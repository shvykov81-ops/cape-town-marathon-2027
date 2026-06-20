import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Cape Town Marathon 2027 — RUN & Travel";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #134e4a 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontFamily: "Inter, system-ui",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "72px", fontWeight: "bold", color: "#14b8a6" }}>
          RUN & Travel
        </div>
        <div style={{ fontSize: "48px", color: "#a3a3a3" }}>
          Cape Town Marathon 2027
        </div>
        <div style={{ fontSize: "32px", color: "#737373", maxWidth: "800px" }}>
          Africa's First Abbott World Marathon Majors Candidate
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#14b8a6",
            marginTop: "40px",
            padding: "16px 32px",
            border: "3px solid #14b8a6",
            borderRadius: "12px",
          }}
        >
          Train with Elite Coaches · Book Your Journey
        </div>
      </div>
    ),
    { ...size }
  );
}
