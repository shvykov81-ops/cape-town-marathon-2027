import { DocumentsTable } from "@/components/admin/documents-table";

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-neutral-400 mt-1">Review and verify user uploads</p>
      </div>
      <DocumentsTable />
    </div>
  );
}
