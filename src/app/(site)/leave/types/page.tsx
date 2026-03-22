"use client";

import { Plus, Pencil, Trash2, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { PageLoader } from "@/components/ui/loader";
import { LeaveTypeDialog } from "@/components/leave/LeaveTypeDialog";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function LeaveTypesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: leaveTypes, loading, refetch } = useList<any>("/leave/types");
  const { delete: deleteType, loading: deleting } = useDelete("/leave/types");

  const handleAdd = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteType(deleteId);
    if (success) {
      refetch();
      setDeleteId(null);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Types</h1>
          <p className="text-sm text-muted-foreground">
            Configure available leave types and policies
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add Leave Type
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : leaveTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl border-muted-foreground/20">
          <Settings2 className="size-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No leave types configured.</p>
          <Button variant="link" onClick={handleAdd}>
            Configure your first leave type
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {leaveTypes.map((type: any) => (
            <Card
              key={type._id}
              className="group transition-all hover:shadow-md hover:border-primary/20"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: type.color || "#ccc" }}
                    />
                    <h3 className="font-semibold">{type.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleEdit(type)}
                    >
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setDeleteId(type._id)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {type.payment === "paid" ? "Paid" : "Unpaid"} ·{" "}
                  {type.carryforward_type}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold">{type.total_days}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Days/Year
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Badge
                      className={cn(
                        "text-[10px]",
                        type.payment === "paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                      )}
                    >
                      {type.payment === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {type.require_approval === "yes"
                        ? "Approval Required"
                        : "No Approval"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LeaveTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leaveType={editingType}
        onSuccess={refetch}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Leave Type"
        description="Are you sure you want to delete this leave type? This may affect existing leave requests."
        confirmText="Delete"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
