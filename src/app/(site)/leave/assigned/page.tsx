"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import { PageLoader } from "@/components/ui/loader";
import { AssignLeaveDialog } from "@/components/leave/AssignLeaveDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AssignedLeavePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const {
    data: allocations,
    loading,
    refetch,
  } = useList<any>("/leave/allocations");
  const { delete: deleteAllocation, loading: deleting } =
    useDelete("/leave/allocations");

  const filtered = (allocations || []).filter((a: any) => {
    const name = `${a.employee_id?.employee_first_name || ""} ${a.employee_id?.employee_last_name || ""}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleAdd = () => {
    setEditingAllocation(null);
    setDialogOpen(true);
  };

  const handleEdit = (alloc: any) => {
    setEditingAllocation(alloc);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteAllocation(deleteId);
    if (success) {
      refetch();
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assigned Leave</h1>
          <p className="text-sm text-muted-foreground">
            Manually assigned leave allocations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button size="sm" className="gap-2" onClick={handleAdd}>
            <Plus className="size-3.5" />
            Assign Leave
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <PageLoader />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Assigned Days</TableHead>
                      <TableHead>Total Days</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a: any) => {
                      const name = `${a.employee_id?.employee_first_name || ""} ${a.employee_id?.employee_last_name || ""}`;
                      return (
                        <TableRow key={a._id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {getInitials(name)}
                              </div>
                              <span className="font-medium">{name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {a.leave_type_id?.name || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {a.available_days} days
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {a.total_leave_days} days
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => handleEdit(a)}
                              >
                                <Pencil className="size-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => setDeleteId(a._id)}
                              >
                                <Trash2 className="size-3.5 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <AssignLeaveDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            allocation={editingAllocation}
            onSuccess={refetch}
          />

          <ConfirmDialog
            isOpen={!!deleteId}
            title="Delete Allocation"
            description="Are you sure you want to delete this leave allocation?"
            confirmText="Delete"
            isDangerous
            isLoading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
