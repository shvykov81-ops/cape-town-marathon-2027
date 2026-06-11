import { NextResponse } from "next/server";
import { auth } from "@/auth";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function fetchWithHeaders(url: string, index = 0): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENTS[index % USER_AGENTS.length],
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Cache-Control": "max-age=0",
      "Cookie": "ig_did=00000000-0000-0000-0000-000000000000; ig_nrcb=1",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function parseOG(html: string) {
  const og = (property: string) => {
    const match = html.match(
      new RegExp(
        `<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      )
    );
    return match?.[1] || "";
  };
  return {
    title: decodeHtmlEntities(og("title")),
    description: decodeHtmlEntities(og("description")),
    image: og("image"),
  };
}

function parseProfilePic(html: string): string {
  const match1 = html.match(/"profile_pic_url"\s*:\s*"([^"]+)"/);
  if (match1) return match1[1].replace(/\u0026/g, "&");

  const match2 = html.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/);
  if (match2) return match2[1].replace(/\u0026/g, "&");

  const match3 = html.match(/"user"\s*:\s*\{[^}]*"profile_pic_url"\s*:\s*"([^"]+)"/);
  if (match3) return match3[1].replace(/\u0026/g, "&");

  const match4 = html.match(/(https:\/\/[^\s"]+\.cdninstagram\.com[^\s"]*\/[^\s"]*\.(?:jpg|jpeg|png|webp))/i);
  if (match4) return match4[1].replace(/\u0026/g, "&");

  const match5 = html.match(/"profile_pic_url"\s*:\s*"(https:\/\/[^"]+)"/);
  if (match5) return match5[1].replace(/\u0026/g, "&");

  return "";
}

async function fetchViaJina(url: string) {
  const jinaUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`;
  const res = await fetch(jinaUrl, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Jina AI failed");
  const text = await res.text();

  const lines = text.split("\n").filter((l) => l.trim());
  const title = decodeHtmlEntities(lines[0]?.replace(/^Title:\s*/, "").trim() || "");
  const desc = decodeHtmlEntities(lines.slice(1).join(" ").trim() || "");

  return { title, description: desc, image: "" };
}

async function fetchViaInstagramAPI(username: string): Promise<string> {
  try {
    const apiUrl = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Instagram 219.0.0.12.117 Android",
        "Accept-Language": "en-US",
        "Cookie": "sessionid=;",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data?.data?.user?.profile_pic_url || "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { url } = await req.json();
    if (!url || !url.includes("instagram.com")) {
      return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
    }

    const username = url.split("instagram.com/")[1]?.split("/")[0]?.split("?")[0];
    if (!username) {
      return NextResponse.json({ error: "Cannot extract username" }, { status: 400 });
    }

    let html = "";
    let ogData = { title: "", description: "", image: "" };
    let error = "";

    for (let i = 0; i < USER_AGENTS.length; i++) {
      try {
        html = await fetchWithHeaders(url, i);
        ogData = parseOG(html);

        if (!ogData.image) {
          ogData.image = parseProfilePic(html);
        }

        if (ogData.title) break;
      } catch (e: any) {
        error = e.message;
      }
    }

    if (!ogData.image) {
      try {
        const apiPic = await fetchViaInstagramAPI(username);
        if (apiPic) ogData.image = apiPic;
      } catch (e: any) {
        error = error ? `${error}, API:${e.message}` : `API:${e.message}`;
      }
    }

    if (!ogData.title) {
      try {
        const jina = await fetchViaJina(url);
        ogData.title = jina.title;
        ogData.description = jina.description;
      } catch (e: any) {
        error = error ? `${error}, Jina:${e.message}` : `Jina:${e.message}`;
      }
    }

    if (!ogData.image) {
      ogData.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D9488&color=fff&size=400`;
    }

    if (!ogData.title && !ogData.description) {
      return NextResponse.json(
        { error: `Instagram unavailable (${error}). Fill manually.` },
        { status: 502 }
      );
    }

    let firstName = "";
    let lastName = "";
    if (ogData.title) {
      const clean = ogData.title.replace(/\(.*?\)/g, "").trim();
      const parts = clean.split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    return NextResponse.json({
      firstName,
      lastName,
      bio: ogData.description,
      photoUrl: ogData.image,
      instagramUrl: url,
    });
  } catch (e) {
    console.error("Instagram preview error:", e);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}
