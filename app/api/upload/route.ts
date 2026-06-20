import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import { checkRateLimit } from "@/lib/rate-limit";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for common image formats
const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // RIFF header, need to check further for WEBP
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const magic = MAGIC_BYTES[mimeType];
  if (!magic) return true; // Unknown type, skip magic check

  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: 5 uploads per minute
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, "/api/upload")) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { name, type, data } = await req.json();

    // Validate inputs
    if (!name || !type || !data) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Check extension
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    // Decode base64
    let buffer: Buffer;
    try {
      buffer = Buffer.from(data, "base64");
    } catch {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
    }

    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Validate magic bytes
    if (!validateMagicBytes(buffer, type)) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    // Generate safe filename
    const fileName = `${user.id.slice(0, 8)}_${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url, fileName });

  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
