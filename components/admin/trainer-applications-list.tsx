"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface TrainerApplication {
  id: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  note: string | null;
  createdAt: string;
}

interface TrainerApplicationsListProps {
  applications: TrainerApplication[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export function TrainerApplicationsList({ applications, onApprove, onReject }: TrainerApplicationsListProps) {
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approving, setApproving] = useState<string | null>(null);

  const statusConfig = {
    PENDING: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
    APPROVED: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
    REJECTED: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
  };

  return (
    <Card className="border-[#1e1e2e] bg-[#111118] overflow-hidden">
      <CardHeader className="border-b border-[#1e1e2e]">
        <CardTitle className="text-white text-xl font-semibold flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          Trainer Applications
          <Badge variant="outline" className="ml-auto bg-[#1a1a25] text-[#8b8b9a] border-[#1e1e2e]">
            {applications.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#5a5a6a] text-lg">No applications yet</p>
            <p className="text-[#3a3a4a] text-sm mt-2">New trainer applications will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {applications.map((app) => {
              const StatusIcon = statusConfig[app.status].icon;
              return (
                <div key={app.id} className="flex items-start gap-4 p-5 hover:bg-[#1a1a25]/50 transition-colors">
                  <Avatar className="w-12 h-12 border-2 border-[#1e1e2e]">
                    <AvatarImage src={app.user.image || undefined} />
                    <AvatarFallback className="bg-[#1a1a25] text-[#8b8b9a] text-sm">
                      {(app.user.name || app.user.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium truncate">{app.user.name || "Unnamed Applicant"}</h3>
                      <Badge variant="outline" className={`${statusConfig[app.status].color} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />{app.status}
                      </Badge>
                    </div>
                    <p className="text-[#5a5a6a] text-sm">{app.user.email}</p>
                    {app.note && <p className="text-[#8b8b9a] text-sm mt-2 line-clamp-2">{app.note}</p>}
                    <p className="text-[#3a3a4a] text-xs mt-2">
                      Applied {new Date(app.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {app.status === "PENDING" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" className="bg-[#00d4aa]/20 text-[#00d4aa] hover:bg-[#00d4aa]/30 border border-[#00d4aa]/30"
                        onClick={() => { setApproving(app.id); onApprove(app.id).finally(() => setApproving(null)); }} disabled={!!approving}>
                        {approving === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}Approve
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                            <XCircle className="w-4 h-4 mr-1" />Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#111118] border-[#1e1e2e] max-w-md">
                          <DialogHeader><DialogTitle className="text-white text-lg">Reject Application</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <label className="text-[#8b8b9a] text-sm mb-2 block">Reason for rejection</label>
                              <Textarea placeholder="Explain why this application is being rejected..." value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-[#3a3a4a] min-h-[120px] resize-none" />
                            </div>
                            <Button variant="destructive" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                              onClick={() => { onReject(app.id, rejectReason); setRejectReason(""); }}
                              disabled={!rejectReason.trim() || rejecting === app.id}>
                              {rejecting === app.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Confirm Rejection
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
