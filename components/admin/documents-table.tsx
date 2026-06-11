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
import { Eye, CheckCircle, XCircle } from "lucide-react";

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

  const statusColor = (s: string) => {
    if (s === "approved")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s === "rejected")
      return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-neutral-400">User</TableHead>
            <TableHead className="text-neutral-400">Document</TableHead>
            <TableHead className="text-neutral-400">Type</TableHead>
            <TableHead className="text-neutral-400">Uploaded</TableHead>
            <TableHead className="text-neutral-400">Status</TableHead>
            <TableHead className="text-neutral-400 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((d) => (
            <TableRow
              key={d.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell>
                <div className="font-medium">
                  {d.user.name || d.user.email}
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={d.url}
                  target="_blank"
                  className="flex items-center gap-2 text-teal-400 hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  {d.name}
                </a>
              </TableCell>
              <TableCell className="text-neutral-400">{d.type}</TableCell>
              <TableCell className="text-sm text-neutral-400">
                {new Date(d.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColor(d.status)}
                >
                  {d.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateStatus(d.id, "approved")}
                  className="hover:bg-green-500/20 text-green-400"
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateStatus(d.id, "rejected")}
                  className="hover:bg-red-500/20 text-red-400"
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
  );
}
