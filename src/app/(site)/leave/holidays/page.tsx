"use client";

import { Plus, Pencil, Trash2, CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { PageLoader } from "@/components/ui/loader";
import { HolidayDialog } from "@/components/leave/HolidayDialog";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function HolidaysPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: holidays, loading, refetch } = useList<any>("/leave/holidays");
  const { delete: deleteHoliday, loading: deleting } =
    useDelete("/leave/holidays");

  const handleAdd = () => {
    setEditingHoliday(null);
    setDialogOpen(true);
  };

  const handleEdit = (holiday: any) => {
    setEditingHoliday(holiday);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteHoliday(deleteId);
    if (success) {
      refetch();
      setDeleteId(null);
    }
  };

  const grouped = holidays.reduce(
    (acc: any, h: any) => {
      const month = new Date(h.start_date).getMonth();
      if (!acc[month]) acc[month] = [];
      acc[month].push(h);
      return acc;
    },
    {} as Record<number, any[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Holidays</h1>
          <p className="text-sm text-muted-foreground">
            {holidays.length} holidays configured for 2026
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add Holiday
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <PageLoader />
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl border-muted-foreground/20">
            <CalendarDays className="size-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">No holidays configured.</p>
            <Button variant="link" onClick={handleAdd}>
              Configure holidays for this year
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([monthIdx, items]: [string, any]) => (
                <Card key={monthIdx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CalendarDays className="size-4 text-primary" />
                      {months[Number(monthIdx)]}
                      <Badge variant="secondary" className="text-[10px]">
                        {items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {items.map((h: any) => (
                      <div
                        key={h._id}
                        className="group flex items-center gap-4 rounded-lg border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex size-10 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="text-xs font-bold">
                            {new Date(h.start_date).getDate()}
                          </span>
                          <span className="text-[9px]">
                            {new Date(h.start_date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                              },
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{h.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(h.start_date).toLocaleDateString()}
                            {h.end_date &&
                              ` - ${new Date(h.end_date).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {h.recurring ? "Recurring" : "One-time"}
                          </Badge>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => handleEdit(h)}
                            >
                              <Pencil className="size-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => setDeleteId(h._id)}
                            >
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        <HolidayDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          holiday={editingHoliday}
          onSuccess={refetch}
        />

        <ConfirmDialog
          isOpen={!!deleteId}
          title="Delete Holiday"
          description="Are you sure you want to delete this holiday?"
          confirmText="Delete"
          isDangerous
          isLoading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </div>
  );
}
