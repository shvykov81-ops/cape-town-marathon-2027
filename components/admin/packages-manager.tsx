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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

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
  const [search, setSearch] = useState("");
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

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-neutral-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={reset} className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f0f0f] border border-white/[0.08] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editing ? "Edit" : "New"} Package</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.priceBase}
                    onChange={(e) => setForm({ ...form, priceBase: e.target.value })}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    value={form.maxParticipants}
                    onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                    className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Active</Label>
                  <div className="flex items-center h-10">
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Includes (comma-separated)</Label>
                <Input
                  value={form.includes}
                  onChange={(e) => setForm({ ...form, includes: e.target.value })}
                  className="bg-white/[0.03] border-white/[0.08] focus:border-teal-500/50"
                  placeholder="Accommodation, Transfers, Meals..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border-0"
              >
                {editing ? "Update" : "Create"} Package
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-neutral-500 font-medium">Name</TableHead>
              <TableHead className="text-neutral-500 font-medium">Type</TableHead>
              <TableHead className="text-neutral-500 font-medium">Duration</TableHead>
              <TableHead className="text-neutral-500 font-medium">Price</TableHead>
              <TableHead className="text-neutral-500 font-medium">Bookings</TableHead>
              <TableHead className="text-neutral-500 font-medium">Status</TableHead>
              <TableHead className="text-neutral-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="font-medium text-white">{pkg.name}</TableCell>
                <TableCell className="text-neutral-400">{pkg.type}</TableCell>
                <TableCell className="text-neutral-400">{pkg.durationDays} days</TableCell>
                <TableCell className="text-teal-400 font-semibold">
                  ${parseFloat(pkg.priceBase).toLocaleString()}
                </TableCell>
                <TableCell className="text-white">{pkg._count.bookings}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={pkg.isActive
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-neutral-500/15 text-neutral-400 border-neutral-500/30"
                    }
                  >
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => edit(pkg)}
                    className="hover:bg-white/10 text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(pkg.id)}
                    className="hover:bg-red-500/15 text-neutral-400 hover:text-red-400"
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
