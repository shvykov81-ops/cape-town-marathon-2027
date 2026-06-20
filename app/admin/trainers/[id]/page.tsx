import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TrainerModerationDetail } from "@/components/admin/trainer-moderation/trainer-moderation-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

function serializeTrainer(trainer: any) {
  return {
    ...trainer,
    createdAt: trainer.createdAt?.toISOString() || null,
    updatedAt: trainer.updatedAt?.toISOString() || null,
    publishedAt: trainer.publishedAt?.toISOString() || null,
    moderatedAt: trainer.moderatedAt?.toISOString() || null,
    changeHistory: trainer.changeHistory.map((ch: any) => ({
      ...ch,
      createdAt: ch.createdAt?.toISOString() || null,
    })),
    reviews: trainer.reviews.map((r: any) => ({
      ...r,
      createdAt: r.createdAt?.toISOString() || null,
    })),
  };
}

export default async function AdminTrainerDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, name: true } },
      changeHistory: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          text: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!trainer) notFound();

  const serializedTrainer = serializeTrainer(trainer);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Trainer Profile</h1>
        <p className="text-neutral-400 mt-1">Review and moderate trainer profile</p>
      </div>
      <TrainerModerationDetail trainer={serializedTrainer} />
    </div>
  );
}
