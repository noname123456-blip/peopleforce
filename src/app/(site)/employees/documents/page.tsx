"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  Upload,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader } from "@/components/ui/loader";
import { UploadDocumentDialog } from "@/components/employees/UploadDocumentDialog";
import { ActionMenu } from "@/components/ui/action-menu";
import { PageLoader } from "@/components/ui/loader";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  ready: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function DocumentRequestsPage() {
  const {
    data,
    loading,
    error,
    search,
    setSearch,
    filters,
    updateFilters,
    refetch,
  } = useList<any>("/documents");
  const { delete: deleteDocument } = useDelete("/documents");
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const success = await deleteDocument(id);
      if (success) refetch();
    }
  };

  const handleDownload = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Requests"
        description="Manage employee document requests and uploads"
        actions={
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="size-3.5" />
            Upload Document
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "status",
            placeholder: "Filter Status",
            value: filters.status || "",
            onChange: (val) =>
              updateFilters({ status: val === "all" ? undefined : val }),
            options: [
              { label: "Pending", value: "pending" },
              { label: "Ready", value: "ready" },
              { label: "Completed", value: "completed" },
              { label: "Rejected", value: "rejected" },
            ],
            allLabel: "All Statuses",
          },
          {
            key: "type",
            placeholder: "Document Type",
            value: filters.type || "",
            onChange: (val) =>
              updateFilters({ type: val === "all" ? undefined : val }),
            options: [
              { label: "Certificate", value: "certificate" },
              { label: "Letter", value: "letter" },
              { label: "Slip", value: "slip" },
              { label: "Report", value: "report" },
              { label: "Other", value: "other" },
            ],
            allLabel: "All Types",
          },
        ]}
        onReset={() => {
          setSearch("");
          updateFilters({ status: undefined, type: undefined });
        }}
      />

      <Card>
        <CardContent className="p-0">
          {!loading && data.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-10 text-muted-foreground/40" />}
              title="No documents found"
              description={
                search || Object.keys(filters).length
                  ? "Try adjusting your filters"
                  : "Upload a document to get started"
              }
              action={
                !search && !Object.keys(filters).length
                  ? {
                      label: "Upload Document",
                      onClick: () => setUploadOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((d) => (
                  <TableRow key={d._id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {d.employee_id?.employee_first_name?.charAt(0) || "?"}
                          {d.employee_id?.employee_last_name?.charAt(0) || ""}
                        </div>
                        <span className="font-medium">
                          {d.employee_id
                            ? `${d.employee_id.employee_first_name} ${d.employee_id.employee_last_name}`
                            : "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="font-medium">{d.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {d.document_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {d.request_date
                        ? new Date(d.request_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          d.priority === "high" || d.priority === "urgent"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        {d.priority?.charAt(0).toUpperCase() +
                          d.priority?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          statusColors[d.status] || "bg-gray-100 text-gray-700",
                        )}
                      >
                        {d.status?.charAt(0).toUpperCase() + d.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionMenu
                        items={[
                          ...(d.file_url
                            ? [
                                {
                                  label: "Download",
                                  icon: <Download className="size-4" />,
                                  onClick: () => handleDownload(d.file_url),
                                },
                              ]
                            : []),
                          {
                            label: "Delete",
                            icon: <Trash2 className="size-4" />,
                            onClick: () => handleDelete(d._id),
                            variant: "destructive" as const,
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
