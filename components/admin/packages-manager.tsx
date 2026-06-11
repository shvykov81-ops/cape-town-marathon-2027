"use client";

import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Package {
  id: string;
  name: string;
  type: string;
  durationDays: number;
  priceBase: string;
  maxParticipants: number;
  description: string;
  includes: string[];
  isActive: boolean;
  _count: { bookings: number };
}

export function PackageManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "",
    durationDays: "",
    priceBase: "",
    maxParticipants: "",
    description: "",
    includes: "",
    isActive: true,
  });

  const fetchPackages = () => {
    fetch("/api/admin/packages")
      .then((r) => r.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const reset = () => {
    setForm({
      name: "",
      type: "",
      durationDays: "",
      priceBase: "",
      maxParticipants: "",
      description: "",
      includes: "",
      isActive: true,
    });
    setEditing(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      durationDays: parseInt(form.durationDays),
      priceBase: parseFloat(String(form.priceBase)),
      maxParticipants: parseInt(form.maxParticipants),
      includes: form.includes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const url = editing
      ? `/api/admin/packages/${editing.id}`
      : "/api/admin/packages";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setIsOpen(false);
      reset();
      fetchPackages();
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete package?")) return;
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    fetchPackages();
  };

  const edit = (pkg: Package) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      type: pkg.type,
      durationDays: String(pkg.durationDays),
      priceBase: String(parseFloat(pkg.priceBase)),
      maxParticipants: String(pkg.maxParticipants),
      description: pkg.description,
      includes: pkg.includes.join(", "),
      isActive: pkg.isActive,
    });
    setIsOpen(true);
  };

  if (loading) return <div className="text-neutral-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={reset} className="bg-teal-600 hover:bg-teal-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "New"} Package</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) =>
                    setForm({ ...form, durationDays: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.priceBase}
                  onChange={(e) =>
                    setForm({ ...form, priceBase: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={form.maxParticipants}
                  onChange={(e) =>
                    setForm({ ...form, maxParticipants: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  required
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
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-white/5 border-white/10"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Includes (comma-separated)</Label>
              <Input
                value={form.includes}
                onChange={(e) =>
                  setForm({ ...form, includes: e.target.value })
                }
                className="bg-white/5 border-white/10"
                placeholder="Accommodation, Transfers, Meals..."
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500"
            >
              {editing ? "Update" : "Create"} Package
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-400">Name</TableHead>
              <TableHead className="text-neutral-400">Type</TableHead>
              <TableHead className="text-neutral-400">Duration</TableHead>
              <TableHead className="text-neutral-400">Price</TableHead>
              <TableHead className="text-neutral-400">Bookings</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-neutral-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.type}</TableCell>
                <TableCell>{pkg.durationDays} days</TableCell>
                <TableCell className="text-teal-400">
                  ${parseFloat(pkg.priceBase).toLocaleString()}
                </TableCell>
                <TableCell>{pkg._count.bookings}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      pkg.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-neutral-500/20 text-neutral-400"
                    }
                  >
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => edit(pkg)}
                    className="hover:bg-white/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(pkg.id)}
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
