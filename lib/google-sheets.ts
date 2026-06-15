import { google } from "googleapis";

function getPrivateKey(): string | undefined {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) return undefined;

  // Handle both escaped newlines (from .env file) and real newlines (from Vercel UI)
  return key.replace(/\\n/g, "\n").replace(/\n/g, "\n");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: getPrivateKey(),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendToSheet({
  spreadsheetId,
  range,
  values,
}: {
  spreadsheetId: string;
  range: string;
  values: any[][];
}) {
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
}
