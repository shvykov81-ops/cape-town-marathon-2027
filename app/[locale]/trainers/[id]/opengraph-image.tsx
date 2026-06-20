import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { TrainerProfileStatus } from "@prisma/client";

export const runtime = "edge";

export const alt = "Cape Town Marathon 2027 Coach";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string; locale: string } }) {
  const { id } = params;

  const trainer = await prisma.trainer.findUnique({
    where: { slug: id, status: TrainerProfileStatus.PUBLISHED },
    select: {
      displayName: true,
      firstName: true,
      lastName: true,
      headline: true,
      photoUrl: true,
      rating: true,
      reviewCount: true,
      specialties: true,
    },
  });

  if (!trainer) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "linear-gradient(135deg, #0a0a0a 0%, #134e4a 50%, #0a0a0a 100%)",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, system-ui",
          }}
        >
          Coach Not Found
        </div>
      ),
      { ...size }
    );
  }

  const displayName = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const specialties = trainer.specialties?.slice(0, 3).join(" · ") || "Marathon Coach";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #134e4a 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "60px",
          gap: "40px",
          fontFamily: "Inter, system-ui",
        }}
      >
        {trainer.photoUrl && (
          <img
            src={trainer.photoUrl}
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #14b8a6",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            color: "white",
          }}
        >
          <div style={{ fontSize: "56px", fontWeight: "bold", color: "#14b8a6" }}>
            {displayName}
          </div>
          <div style={{ fontSize: "32px", color: "#a3a3a3" }}>
            {trainer.headline || "Elite Marathon Coach"}
          </div>
          <div style={{ fontSize: "24px", color: "#737373" }}>
            {specialties}
          </div>
          <div style={{ fontSize: "28px", color: "#fbbf24", marginTop: "20px" }}>
            {"⭐".repeat(Math.round(trainer.rating || 0))}
            <span style={{ color: "#a3a3a3", marginLeft: "12px" }}>
              {trainer.rating?.toFixed(1) || "0.0"} ({trainer.reviewCount || 0} reviews)
            </span>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#14b8a6",
              marginTop: "30px",
              padding: "12px 24px",
              border: "2px solid #14b8a6",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            Cape Town Marathon 2027 — RUN & Travel
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
