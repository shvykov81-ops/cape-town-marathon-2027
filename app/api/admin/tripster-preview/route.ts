import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

const BIO_KEYWORDS = [
  "винное", "вино", "кейптаун", "переехал", "родился", "вырос", "образование",
  "профессия", "работа", "люблю", "увлекаюсь", "занимаюсь", "провожу", "экскурсии",
  "гид", "путешествия", "туризм", "история", "культура", "язык", "английский",
  "русский", "африка", "юар", "южная африка", "столовая гора", "таблица",
];

const STOP_SECTIONS = [
  "о проекте", "помощь", "партнёрам", "партнерам", "вакансии", "блог",
  "прессе", "правила", "политика", "конфиденциальности", "пользовательское соглашение",
  "подписка", "рассылка", "социальные сети", "facebook", "vk", "telegram",
  "instagram", "youtube", "приложение", "app store", "google play", "©",
  "все права", "обратная связь", "контакты", "реклама", "сотрудничество",
  "проверка", "отзывы", "рейтинг", "экскурсии от", "другие экскурсии",
  "похожие экскурсии", "что включено", "что не включено", "правила отмены",
  "дополнительные расходы", "встреча", "развлечения", "размещение",
];

function isBioStart(line: string): boolean {
  const lower = line.toLowerCase();
  return BIO_KEYWORDS.some((kw) => lower.includes(kw));
}

function isStopSection(line: string): boolean {
  const lower = line.toLowerCase();
  return STOP_SECTIONS.some((stop) => lower.includes(stop));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { url } = await req.json();
    if (!url || !url.includes("tripster.ru")) {
      return NextResponse.json({ error: "Invalid Tripster URL" }, { status: 400 });
    }

    let title = "";
    let description = "";
    let rating = 0;
    let reviewCount = 0;

    const jinaUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`;
    const jinaRes = await fetch(jinaUrl, {
      headers: { 
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/plain",
      },
      next: { revalidate: 0 },
    });

    if (jinaRes.ok) {
      const jinaText = await jinaRes.text();
      const lines = jinaText.split("\n");

      const titleLine = lines.find((l) => l.trim().startsWith("Title:"));
      if (titleLine) {
        title = decodeHtmlEntities(titleLine.replace(/^Title:\s*/, "").trim());
      }

      const ratingMatch = title.match(/рейтинг\s+([\d,]+)/i);
      if (ratingMatch) rating = parseFloat(ratingMatch[1].replace(",", "."));

      const reviewMatch = title.match(/(\d+)\s*отзыв/i);
      if (reviewMatch) reviewCount = parseInt(reviewMatch[1]);

      const mdIndex = lines.findIndex((l) => l.includes("Markdown Content:"));
      if (mdIndex >= 0) {
        const descLines: string[] = [];
        let started = false;

        for (let i = mdIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith("URL Source:")) break;
          if (!line) continue;

          if (!started) {
            if (line.startsWith("[") || line.startsWith("!")) continue;
            if (isBioStart(line) || line.length > 50) {
              started = true;
            } else {
              continue;
            }
          }

          if (isStopSection(line)) break;
          if (line.startsWith("![")) continue;

          const cleanLine = line.replace(/^#+\s*/, "").trim();
          if (cleanLine) {
            descLines.push(cleanLine);
          }
        }

        description = decodeHtmlEntities(descLines.join(" ").trim());

        if (description.length > 800) {
          description = description.substring(0, 800) + "...";
        }
      }
    }

    let image = "";
    const directRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html",
      },
      next: { revalidate: 0 },
    });

    if (directRes.ok) {
      const html = await directRes.text();

      const avatarPatterns = [
        /"avatar"[^>]*src=["'](https:\/\/[^"']*cdn\.tripster\.ru[^"']*\.(?:jpg|jpeg|png|webp))["']/i,
        /"guide-avatar"[^>]*src=["'](https:\/\/[^"']*cdn\.tripster\.ru[^"']*\.(?:jpg|jpeg|png|webp))["']/i,
        /src=["'](https:\/\/[^"']*cdn\.tripster\.ru[^"']*\/avatars?[^"']*\.(?:jpg|jpeg|png|webp))["']/i,
        /src=["'](https:\/\/[^"']*cdn\.tripster\.ru[^"']*\.(?:jpg|jpeg|png|webp))["']/i,
      ];

      for (const pattern of avatarPatterns) {
        const match = html.match(pattern);
        if (match) {
          image = match[1];
          break;
        }
      }

      if (!image) {
        const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/s) ||
                          html.match(/window\.__DATA__\s*=\s*({.+?});/s);
        if (jsonMatch) {
          try {
            const data = JSON.parse(jsonMatch[1]);
            const avatar = data?.guide?.avatar || data?.guide?.photo || data?.user?.avatar;
            if (avatar) image = avatar;
          } catch {
            // ignore
          }
        }
      }
    }

    let firstName = "";
    let lastName = "";
    if (title) {
      const nameMatch = title.match(/гид\s+([А-Яа-яЁёA-Za-z]+)(?:\s+([А-Яа-яЁёA-Za-z]+))?/i);
      if (nameMatch) {
        firstName = nameMatch[1] || "";
        lastName = nameMatch[2] || "";
      } else {
        const clean = title
          .replace(/частный гид/i, "")
          .replace(/экскурсии от \$?\d+/i, "")
          .replace(/в [А-Яа-яЁё]+/i, "")
          .replace(/,\s*\d+ отзыв.*/i, "")
          .replace(/рейтинг.*/i, "")
          .trim();
        const parts = clean.split(/\s+/);
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }
    }

    return NextResponse.json({
      firstName,
      lastName,
      bio: description,
      photoUrl: image,
      photos: image ? [image] : [],
      tripsterUrl: url,
      rating,
      reviewCount,
    });
  } catch (e) {
    console.error("[Tripster] Error:", e);
    return NextResponse.json(
      { error: "Failed to fetch Tripster data" },
      { status: 500 }
    );
  }
}
