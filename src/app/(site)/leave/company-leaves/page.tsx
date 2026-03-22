"use client";

import { Plus, Pencil, Trash2, Building2, Calendar } from "lucide-react";
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
import { CompanyLeaveDialog } from "@/components/leave/CompanyLeaveDialog";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const WEEKS: Record<string, string> = {
  "1": "1st",
  "2": "2nd",
  "3": "3rd",
  "4": "4th",
};

function formatLeaveDay(leave: any) {
  const dayName = WEEK_DAYS[Number(leave.based_on_week_day)] || "";
  if (!leave.based_on_week) return `Every ${dayName}`;
  const weekPrefix = WEEKS[leave.based_on_week] || "";
  return `${weekPrefix} ${dayName}`;
}

export default function CompanyLeavesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: companyLeaves,
    loading,
    refetch,
  } = useList<any>("/leave/company-leaves");
  const { delete: deleteLeave, loading: deleting } = useDelete(
    "/leave/company-leaves",
  );

  const handleAdd = () => {
    setEditingLeave(null);
    setDialogOpen(true);
  };

  const handleEdit = (leave: any) => {
    setEditingLeave(leave);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteLeave(deleteId);
    if (success) {
      refetch();
      setDeleteId(null);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Leaves</h1>
          <p className="text-sm text-muted-foreground">
            Configure company-wide off days
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add Company Leave
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent className="p-0">
            {companyLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="size-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground">
                  No recurring company leaves configured.
                </p>
                <Button variant="link" onClick={handleAdd}>
                  Add your first recurring off day
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Based On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyLeaves.map((l: any) => (
                    <TableRow key={l._id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-primary" />
                          <span className="font-medium">
                            {formatLeaveDay(l)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {l.based_on_week ? "Monthly" : "Weekly"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleEdit(l)}
                          >
                            <Pencil className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => setDeleteId(l._id)}
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

      <CompanyLeaveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leave={editingLeave}
        onSuccess={refetch}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Company Leave"
        description="Are you sure you want to delete this recurring off day?"
        confirmText="Delete"
        isDangerous
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
