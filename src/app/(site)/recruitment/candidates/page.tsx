"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  LayoutList,
  LayoutGrid,
  Building2,
  Phone,
  Mail,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CreateCandidateDialog } from "@/components/recruitment/CreateCandidateDialog";
import { Loader } from "@/components/ui/loader";
import { ActionMenu } from "@/components/ui/action-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { PageHeader } from "@/components/ui/page-header";

// Helper for status colors
const statusColors: Record<string, { badge: string; ribbon: string }> = {
  Converted: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    ribbon: "bg-emerald-500",
  },
  Hired: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    ribbon: "bg-blue-500",
  },
  "Not-Hired": {
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    ribbon: "bg-red-500",
  },
  Canceled: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    ribbon: "bg-gray-500",
  },
  "In Progress": {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    ribbon: "bg-amber-500",
  },
  // Default fallback
  Applied: {
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    ribbon: "bg-slate-500",
  },
};

export default function CandidatesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const {
    data,
    loading,
    pagination,
    search,
    setSearch: handleSearch,
    filters,
    updateFilters,
    goToPage,
    refetch,
  } = useList<any>("/candidates", {
    defaultLimit: 12,
  });

  const { data: stages } = useList<any>("/stages");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const { delete: deleteCandidate } = useDelete("/candidates");

  const page = pagination.page;
  const setSearch = (val: string) => {
    handleSearch(val);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this candidate?")) {
      const success = await deleteCandidate(id);
      if (success) refetch();
    }
  };

  const handleEdit = (candidate: any) => {
    setEditingCandidate(candidate);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCandidate(null);
    setDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Candidates"
        description={`${pagination?.total || 0} total candidates across all recruitments`}
        actions={
          <Button onClick={handleCreate} size="sm" className="gap-2">
            <Plus className="size-3.5" />
            Create
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "stage_id",
            placeholder: "Filter Stage",
            value: filters.stage_id || "",
            onChange: (val) =>
              updateFilters({ stage_id: val === "all" ? undefined : val }),
            options:
              stages?.map((s: any) => ({
                label: s.stage,
                value: s._id,
              })) || [],
            allLabel: "All Stages",
          },
        ]}
        onReset={() => {
          setSearch("");
          updateFilters({ stage_id: undefined });
        }}
      />

      {/* Status Legend - simplifying to common ones */}
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(statusColors)
          .slice(0, 5)
          .map(([status, colors]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <span className={cn("size-2.5 rounded-full", colors.ribbon)} />
              <span className="text-muted-foreground">{status}</span>
            </div>
          ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader />
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((candidate) => {
                const status = candidate.status || "In Progress";
                const colors =
                  statusColors[status] || statusColors["In Progress"];
                return (
                  <Card
                    key={candidate._id}
                    className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
                  >
                    {/* Status ribbon */}
                    <div
                      className={cn(
                        "absolute right-0 top-0 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white",
                        colors.ribbon,
                        "origin-center rotate-0 rounded-bl-lg",
                      )}
                    >
                      {status}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border bg-primary/10 text-primary font-bold">
                          <AvatarFallback>
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 pt-1">
                          <p className="truncate font-semibold">
                            {candidate.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {candidate.email}
                          </p>
                        </div>
                        <ActionMenu
                          items={[
                            {
                              label: "Edit",
                              icon: <Pencil className="size-4" />,
                              onClick: () => handleEdit(candidate),
                            },
                            {
                              label: "Delete",
                              icon: <Trash2 className="size-4" />,
                              onClick: () => handleDelete(candidate._id),
                              variant: "destructive" as const,
                            },
                          ]}
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="size-3.5 shrink-0" />
                          <span className="truncate">
                            {candidate.recruitment_id?.title || "No Job"}
                          </span>
                        </div>
                        {candidate.mobile && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="size-3.5 shrink-0" />
                            <span>{candidate.mobile}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((c) => {
                      const status = c.status || "In Progress";
                      const colors =
                        statusColors[status] || statusColors["In Progress"];
                      return (
                        <TableRow key={c._id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 bg-primary/10 text-primary text-[10px] font-bold">
                                <AvatarFallback>
                                  {getInitials(c.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{c.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {c.email}
                          </TableCell>
                          <TableCell>
                            {c.recruitment_id?.title || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {c.mobile || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-[10px]", colors.badge)}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <ActionMenu
                              items={[
                                {
                                  label: "Edit",
                                  icon: <Pencil className="size-4" />,
                                  onClick: () => handleEdit(c),
                                },
                                {
                                  label: "Delete",
                                  icon: <Trash2 className="size-4" />,
                                  onClick: () => handleDelete(c._id),
                                  variant: "destructive" as const,
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={page === pagination.pages}
                  onClick={() => goToPage(page + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CreateCandidateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
        candidate={editingCandidate}
      />
    </div>
  );
}
