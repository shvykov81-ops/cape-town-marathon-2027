"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Instagram, Loader2, ExternalLink, User, Star } from "lucide-react";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  credentials: string;
  photoUrl: string | null;
  photos: string[];
  instagramUrl: string | null;
  tripsterUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  isActive: boolean;
}

export function TrainerManager() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    credentials: "",
    photoUrl: "",
    photos: [] as string[],
    instagramUrl: "",
    tripsterUrl: "",
    rating: "",
    reviewCount: "",
    specialties: "",
    languages: "",
    isActive: true,
  });
  const [tsLoading, setTsLoading] = useState(false);
  const [tsError, setTsError] = useState("");

  const fetchTrainers = () => {
    fetch("/api/admin/trainers")
      .then((r) => r.json())
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const reset = () => {
    setForm({
      firstName: "",
      lastName: "",
      bio: "",
      credentials: "",
      photoUrl: "",
      photos: [],
      instagramUrl: "",
      tripsterUrl: "",
      rating: "",
      reviewCount: "",
      specialties: "",
      languages: "",
      isActive: true,
    });
    setEditing(null);
    setTsError("");
  };

  const fetchTripster = async () => {
    const url = form.tripsterUrl.trim();
    if (!url || !url.includes("tripster.ru")) {
      setTsError("Enter a valid Tripster URL");
      return;
    }
    setTsLoading(true);
    setTsError("");
    try {
      const res = await fetch("/api/admin/tripster-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTsError(data.error || "Failed to load");
      } else {
        setForm((prev) => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          bio: data.bio || prev.bio,
          photoUrl: data.photoUrl || prev.photoUrl,
          photos: data.photos || prev.photos,
          rating: String(data.rating || prev.rating),
          reviewCount: String(data.reviewCount || prev.reviewCount),
        }));
      }
    } catch {
      setTsError("Network error");
    } finally {
      setTsLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      rating: parseFloat(form.rating) || 0,
      reviewCount: parseInt(form.reviewCount) || 0,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: form.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const url = editing
      ? `/api/admin/trainers/${editing.id}`
      : "/api/admin/trainers";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setIsOpen(false);
      reset();
      fetchTrainers();
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete trainer?")) return;
    await fetch(`/api/admin/trainers/${id}`, { method: "DELETE" });
    fetchTrainers();
  };

  const edit = (t: Trainer) => {
    setEditing(t);
    setForm({
      firstName: t.firstName,
      lastName: t.lastName,
      bio: t.bio,
      credentials: t.credentials || "",
      photoUrl: t.photoUrl || "",
      photos: t.photos || [],
      instagramUrl: t.instagramUrl || "",
      tripsterUrl: t.tripsterUrl || "",
      rating: String(t.rating),
      reviewCount: String(t.reviewCount),
      specialties: t.specialties.join(", "),
      languages: t.languages.join(", "),
      isActive: t.isActive,
    });
    setTsError("");
    setIsOpen(true);
  };

  if (loading) return <div className="text-neutral-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={reset} className="bg-teal-600 hover:bg-teal-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Trainer
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "New"} Trainer
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {/* Tripster URL + Fetch */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                Tripster URL
              </Label>
              <div className="flex gap-2">
                <Input
                  value={form.tripsterUrl}
                  onChange={(e) =>
                    setForm({ ...form, tripsterUrl: e.target.value })
                  }
                  className="bg-white/5 border-white/10 flex-1"
                  placeholder="https://experience.tripster.ru/guide/..."
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchTripster}
                  disabled={tsLoading || !form.tripsterUrl}
                  className="border-white/10 hover:bg-white/5"
                >
                  {tsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Load
                </Button>
              </div>
              {tsError && (
                <p className="text-xs text-red-400">{tsError}</p>
              )}
              <p className="text-xs text-neutral-500">
                Paste Tripster guide link and click Load to auto-fill name, bio, photo and rating.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <Input
                  value={form.photoUrl}
                  onChange={(e) =>
                    setForm({ ...form, photoUrl: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm({ ...form, isActive: v })
                    }
                  />
                </div>
              </div>
            </div>

            {form.photoUrl && (
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={form.photoUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  Rating
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  placeholder="4.8"
                />
              </div>
              <div className="space-y-2">
                <Label>Review Count</Label>
                <Input
                  type="number"
                  value={form.reviewCount}
                  onChange={(e) =>
                    setForm({ ...form, reviewCount: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  placeholder="42"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Credentials</Label>
              <Input
                value={form.credentials}
                onChange={(e) =>
                  setForm({ ...form, credentials: e.target.value })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
                className="bg-white/5 border-white/10"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specialties (comma-separated)</Label>
                <Input
                  value={form.specialties}
                  onChange={(e) =>
                    setForm({ ...form, specialties: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  placeholder="Marathon, Nutrition..."
                />
              </div>
              <div className="space-y-2">
                <Label>Languages (comma-separated)</Label>
                <Input
                  value={form.languages}
                  onChange={(e) =>
                    setForm({ ...form, languages: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  placeholder="English, Russian..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
                className="bg-white/5 border-white/10"
                placeholder="https://instagram.com/username"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500"
            >
              {editing ? "Update" : "Create"} Trainer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-400">Name</TableHead>
              <TableHead className="text-neutral-400">Rating</TableHead>
              <TableHead className="text-neutral-400">Specialties</TableHead>
              <TableHead className="text-neutral-400">Languages</TableHead>
              <TableHead className="text-neutral-400">Links</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-neutral-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainers.map((t) => (
              <TableRow
                key={t.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {t.photoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-neutral-800">
                        <Image
                          src={t.photoUrl}
                          alt={`${t.firstName} ${t.lastName}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-neutral-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {t.firstName} {t.lastName}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {t.credentials}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{t.rating.toFixed(1)}</span>
                    <span className="text-xs text-neutral-400">({t.reviewCount})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {t.specialties.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="bg-teal-500/10 text-teal-400 text-xs"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {t.languages.map((l) => (
                      <Badge
                        key={l}
                        variant="outline"
                        className="bg-blue-500/10 text-blue-400 text-xs"
                      >
                        {l}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {t.instagramUrl && (
                      <a
                        href={t.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {t.tripsterUrl && (
                      <a
                        href={t.tripsterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      t.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-neutral-500/20 text-neutral-400"
                    }
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => edit(t)}
                    className="hover:bg-white/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(t.id)}
                    className="hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
