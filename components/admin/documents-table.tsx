"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, FileText, Search } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
  uploadedAt: string;
  user: { name: string | null; email: string };
}

export function DocumentsTable() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState("");

  const fetchDocs = () =>
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then(setDocs);

  useEffect(() => {
    fetchDocs();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchDocs();
  };

  const statusConfig = (s: string) => {
    switch (s) {
      case "approved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
  };

  const filtered = docs.filter(d =>
    (d.user.name || d.user.email).toLowerCase().includes(search.toLowerCase()) ||
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-neutral-500 font-medium">User</TableHead>
              <TableHead className="text-neutral-500 font-medium">Document</TableHead>
              <TableHead className="text-neutral-500 font-medium">Type</TableHead>
              <TableHead className="text-neutral-500 font-medium">Uploaded</TableHead>
              <TableHead className="text-neutral-500 font-medium">Status</TableHead>
              <TableHead className="text-neutral-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow
                key={d.id}
                className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell>
                  <div className="font-medium text-white">
                    {d.user.name || d.user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={d.url}
                    target="_blank"
                    className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {d.name}
                  </a>
                </TableCell>
                <TableCell className="text-neutral-400">{d.type}</TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {new Date(d.uploadedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusConfig(d.status)} border`}
                  >
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateStatus(d.id, "approved")}
                    className="hover:bg-emerald-500/15 text-emerald-400 hover:text-emerald-300"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateStatus(d.id, "rejected")}
                    className="hover:bg-red-500/15 text-red-400 hover:text-red-300"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
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
