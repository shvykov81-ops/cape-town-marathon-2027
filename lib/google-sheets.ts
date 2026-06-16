import { google } from "googleapis";

function getPrivateKey(): string | undefined {
  // Priority 1: Base64-encoded key (recommended for Vercel)
  const base64Key = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (base64Key) {
    try {
      const decoded = Buffer.from(base64Key, "base64").toString("utf-8");
      // Validate it looks like a PEM key
      if (decoded.includes("BEGIN PRIVATE KEY") && decoded.includes("END PRIVATE KEY")) {
        return decoded;
      }
      console.warn("[Google Sheets] GOOGLE_PRIVATE_KEY_BASE64 decoded but invalid format");
    } catch (e) {
      console.error("[Google Sheets] Failed to decode GOOGLE_PRIVATE_KEY_BASE64:", e);
    }
  }

  // Priority 2: Raw key from .env
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!rawKey) {
    console.warn("[Google Sheets] No private key found. Set GOOGLE_PRIVATE_KEY_BASE64 or GOOGLE_PRIVATE_KEY");
    return undefined;
  }

  // Handle both escaped newlines (from .env file) and real newlines (from Vercel UI)
  // First normalize double-escaped backslashes, then convert escaped newlines to real newlines
  let normalized = rawKey.replace(/\\\\/g, "\\").replace(/\\n/g, "\n");

  return normalized;
}

function createAuth() {
  const privateKey = getPrivateKey();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    console.warn("[Google Sheets] Missing credentials. Sheets sync will be skipped.");
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const auth = createAuth();
const sheets = auth ? google.sheets({ version: "v4", auth }) : null;

export async function appendToSheet({
  spreadsheetId,
  range,
  values,
}: {
  spreadsheetId: string;
  range: string;
  values: any[][];
}) {
  if (!sheets) {
    console.warn("[Google Sheets] Sheets API not initialized. Skipping append.");
    return null;
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    console.log(
      `[Google Sheets] Appended ${response.data.updates?.updatedRows} row(s) to ${range}`
    );
    return response;
  } catch (error) {
    console.error("[Google Sheets] Append failed:", error);
    throw error;
  }
}

export async function updateSheetRow({
  spreadsheetId,
  range,
  values,
}: {
  spreadsheetId: string;
  range: string;
  values: any[][];
}) {
  if (!sheets) {
    console.warn("[Google Sheets] Sheets API not initialized. Skipping update.");
    return null;
  }

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    console.log(`[Google Sheets] Updated ${range}`);
    return response;
  } catch (error) {
    console.error("[Google Sheets] Update failed:", error);
    throw error;
  }
}
