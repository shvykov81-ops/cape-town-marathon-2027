export const runtime = "nodejs";
export const revalidate = 60;

import { ImageResponse } from "next/og";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const getTrainerForOG = unstable_cache(
    async (id: string) => {
        return prisma.trainer.findUnique({
            where: { slug: id, status: "PUBLISHED" },
            select: {
                displayName: true,
                headline: true,
                photoUrl: true,
                rating: true,
                reviewCount: true,
            },
        });
    },
    ["trainer-og"],
    { tags: ["trainers"] }
);

export const alt = "Trainer Profile";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { id: string } }) {
    const trainer = await getTrainerForOG(params.id);

    return new ImageResponse(
        (
            <div
                style={{
                    background: "#0a0a0f",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: 48,
                    gap: 40,
                }}
            >
                {trainer?.photoUrl && (
                    <img
                        src={trainer.photoUrl}
                        style={{
                            width: 280,
                            height: 280,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #ff6b35",
                        }}
                    />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div
                        style={{
                            fontSize: 56,
                            fontWeight: 700,
                            color: "#ffffff",
                            fontFamily: "Inter",
                        }}
                    >
                        {trainer?.displayName || "Coach"}
                    </div>
                    <div
                        style={{
                            fontSize: 28,
                            color: "#8b8b9a",
                            fontFamily: "Inter",
                        }}
                    >
                        {trainer?.headline || "Running Coach"}
                    </div>
                    {trainer?.rating && (
                        <div
                            style={{
                                fontSize: 24,
                                color: "#ff6b35",
                                fontFamily: "Inter",
                                marginTop: 16,
                            }}
                        >
                            ⭐ {trainer.rating.toFixed(1)} ({trainer.reviewCount || 0} reviews)
                        </div>
                    )}
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}