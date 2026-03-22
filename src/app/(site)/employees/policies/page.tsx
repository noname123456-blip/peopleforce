"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loader";
import { PolicyDialog } from "@/components/employees/PolicyDialog";
import { ActionMenu } from "@/components/ui/action-menu";

const categoryColors: Record<string, string> = {
  Work: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Leave:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Conduct: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  IT: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  General: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Finance: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

export default function PoliciesPage() {
  const { data, loading, search, setSearch, filters, updateFilters, refetch } =
    useList<any>("/policies");
  const { delete: deletePolicy } = useDelete("/policies");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      const success = await deletePolicy(id);
      if (success) refetch();
    }
  };

  const handleEdit = (policy: any) => {
    setSelectedPolicy(policy);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPolicy(null);
    setDialogOpen(true);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies"
        description="Company policies and guidelines"
        actions={
          <Button size="sm" className="gap-2" onClick={handleCreate}>
            <Plus className="size-3.5" />
            Add Policy
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "category",
            placeholder: "Category",
            value: filters.category || "",
            onChange: (val) =>
              updateFilters({ category: val === "all" ? undefined : val }),
            options: [
              { label: "Work", value: "Work" },
              { label: "Leave", value: "Leave" },
              { label: "Conduct", value: "Conduct" },
              { label: "IT", value: "IT" },
              { label: "Finance", value: "Finance" },
              { label: "General", value: "General" },
            ],
            allLabel: "All Categories",
          },
          {
            key: "status",
            placeholder: "Status",
            value: filters.status || "",
            onChange: (val) =>
              updateFilters({ status: val === "all" ? undefined : val }),
            options: [
              { label: "Active", value: "Active" },
              { label: "Draft", value: "Draft" },
              { label: "Archived", value: "Archived" },
            ],
            allLabel: "All Statuses",
          },
        ]}
        onReset={() => {
          setSearch("");
          updateFilters({ category: undefined, status: undefined });
        }}
      />

      {!loading && data.length === 0 ? (
        <EmptyState
          icon={<Shield className="size-6" />}
          title="No policies found"
          description={
            search || Object.keys(filters).length
              ? "Try adjusting your filters"
              : "Add a policy to get started"
          }
          action={
            !search && !Object.keys(filters).length
              ? { label: "Add Policy", onClick: handleCreate }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <Card
              key={p._id}
              className="group relative transition-all hover:shadow-lg hover:border-primary/20"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="size-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[10px]",
                        categoryColors[p.category] ||
                          "bg-gray-100 text-gray-700",
                      )}
                    >
                      {p.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        p.status === "Active"
                          ? ""
                          : "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400",
                      )}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="size-3" />
                  Updated{" "}
                  {p.updatedAt
                    ? new Date(p.updatedAt).toLocaleDateString()
                    : "-"}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil className="size-4" />,
                        onClick: () => handleEdit(p),
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="size-4" />,
                        onClick: () => handleDelete(p._id),
                        variant: "destructive" as const,
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PolicyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
        policy={selectedPolicy}
      />
    </div>
  );
}
