"use client";

import { useState, useMemo } from "react";
import { useList } from "@/hooks/use-list";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  User,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate } from "@/hooks/use-create";
import { useDelete } from "@/hooks/use-delete";
import { useUpdate } from "@/hooks/use-update";

// Recursive Component for Tree Node
const OrgNode = ({
  node,
  childrenMap,
  level = 0,
  onAdd,
  onEdit,
  onDelete,
}: any) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = childrenMap[node._id] && childrenMap[node._id].length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center p-2">
        {/* Connector line from parent */}
        {level > 0 && <div className="absolute top-0 h-4 w-px bg-border" />}

        <Card
          className={cn(
            "w-64 p-3 flex items-center gap-3 relative z-10 transition-all hover:shadow-md border-t-4",
            node.department === "Management"
              ? "border-t-primary"
              : node.department === "HR"
                ? "border-t-pink-500"
                : node.department === "Tech"
                  ? "border-t-blue-500"
                  : "border-t-gray-400",
          )}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={node.employee_id?.employee_profile} />
            <AvatarFallback>
              {node.employee_id?.employee_first_name?.[0]}
              {node.employee_id?.employee_last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {node.employee_id?.employee_first_name}{" "}
              {node.employee_id?.employee_last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {node.position_title}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={() => onEdit(node)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(node._id)}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={() => onAdd(node._id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </Card>

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -bottom-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="relative flex pt-4">
          {/* Horizontal connector line */}
          <div className="absolute top-0 left-1/2 -ml-px h-4 w-px bg-border" />
          {childrenMap[node._id].length > 1 && (
            <div className="absolute top-4 left-0 right-0 h-px bg-border mx-auto w-[calc(100%-16rem)]" /> // Simplified connector logic
          )}

          <div className="flex gap-4 items-start justify-center">
            {childrenMap[node._id].map((child: any) => (
              <OrgNode
                key={child._id}
                node={child}
                childrenMap={childrenMap}
                level={level + 1}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function OrgChartBuilder() {
  const { data, loading, refetch } = useList<any>("/org-chart");
  const { create } = useCreate("/org-chart");
  const { update } = useUpdate("/org-chart");
  const { delete: deleteNode } = useDelete("/org-chart");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    employee_id: "",
    position_title: "",
    department: "",
  });

  // Fetch employees for dropdown
  const { data: employees } = useList<any>("/employees", { defaultLimit: 100 });

  // Build tree structure
  const { rootNodes, childrenMap } = useMemo(() => {
    const childrenMap: Record<string, any[]> = {};
    const rootNodes: any[] = [];

    data.forEach((node) => {
      if (!node.parent_id) {
        rootNodes.push(node);
      } else {
        if (!childrenMap[node.parent_id]) {
          childrenMap[node.parent_id] = [];
        }
        childrenMap[node.parent_id].push(node);
      }
    });

    return { rootNodes, childrenMap };
  }, [data]);

  const handleAdd = (parentId: string | null) => {
    setEditingNode(null);
    setSelectedParent(parentId);
    setFormData({ employee_id: "", position_title: "", department: "" });
    setDialogOpen(true);
  };

  const handleEdit = (node: any) => {
    setEditingNode(node);
    setSelectedParent(node.parent_id);
    setFormData({
      employee_id: node.employee_id?._id || node.employee_id,
      position_title: node.position_title,
      department: node.department,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (editingNode) {
      success = await update(
        editingNode._id,
        {
          ...formData,
          parent_id: selectedParent,
        },
        { successMessage: "Node updated" },
      );
    } else {
      success = await create(
        {
          ...formData,
          parent_id: selectedParent,
        },
        { successMessage: "Node added to Org Chart" },
      );
    }

    if (success) {
      setDialogOpen(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure? This will promote any direct reports to the manager's manager.",
      )
    ) {
      const success = await deleteNode(id);
      if (success) refetch();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader size="md" />
      </div>
    );

  return (
    <div className="overflow-auto p-8 min-h-[500px] border rounded-lg bg-slate-50/50 dark:bg-slate-900/10">
      {rootNodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <User className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No Org Chart found.</p>
          <Button onClick={() => handleAdd(null)}>Create Root Node</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 min-w-max">
          {rootNodes.map((node) => (
            <OrgNode
              key={node._id}
              node={node}
              childrenMap={childrenMap}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNode
                ? "Edit Node"
                : selectedParent
                  ? "Add Direct Report"
                  : "Add Root Node"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Employee</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(val) =>
                  setFormData({ ...formData, employee_id: val })
                }
                disabled={!!editingNode} // Disable employee change on edit to avoid confusion
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp: any) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.employee_first_name} {emp.employee_last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Position Title</Label>
              <Input
                value={formData.position_title}
                onChange={(e) =>
                  setFormData({ ...formData, position_title: e.target.value })
                }
                placeholder="e.g. Senior Developer"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(val) =>
                  setFormData({ ...formData, department: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              {editingNode ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
