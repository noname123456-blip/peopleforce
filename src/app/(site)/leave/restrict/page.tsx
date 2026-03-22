"use client";

import { Plus, Pencil, Trash2, ShieldAlert, Calendar } from "lucide-react";
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

import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { PageLoader } from "@/components/ui/loader";
import { RestrictionDialog } from "@/components/leave/RestrictionDialog";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDate } from "@/utils/formatters";

export default function RestrictLeavesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRestriction, setEditingRestriction] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: restrictions,
    loading,
    refetch,
  } = useList<any>("/leave/restrictions");
  const { delete: deleteRestriction, loading: deleting } = useDelete(
    "/leave/restrictions",
  );

  const handleAdd = () => {
    setEditingRestriction(null);
    setDialogOpen(true);
  };

  const handleEdit = (res: any) => {
    setEditingRestriction(res);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteRestriction(deleteId);
    if (success) {
      refetch();
      setDeleteId(null);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Restrict Leaves</h1>
          <p className="text-sm text-muted-foreground">
            Configure leave restriction periods
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add Restriction
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent className="p-0">
            {restrictions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShieldAlert className="size-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground">
                  No leave restrictions configured.
                </p>
                <Button variant="link" onClick={handleAdd}>
                  Add your first restriction
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restrictions.map((r: any) => (
                    <TableRow key={r._id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="size-4 text-amber-500" />
                          <span className="font-medium">{r.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {r.leave_type_id?.name || "All"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(r.start_date)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(r.end_date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {r.department_id?.name || "All"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {r.reason}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleEdit(r)}
                          >
                            <Pencil className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => setDeleteId(r._id)}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <RestrictionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        restriction={editingRestriction}
        onSuccess={refetch}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Restriction"
        description="Are you sure you want to delete this leave restriction?"
        confirmText="Delete"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
