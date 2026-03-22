"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";

interface SkillZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  skillZone?: any;
}

export function SkillZoneDialog({
  open,
  onOpenChange,
  onSuccess,
  skillZone,
}: SkillZoneDialogProps) {
  const { create, loading: creating } = useCreate("/skill-zones");
  const { update, loading: updating } = useUpdate("/skill-zones");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Junior",
    requiredSkills: "",
  });

  useEffect(() => {
    if (skillZone) {
      setFormData({
        title: skillZone.title || "",
        description: skillZone.description || "",
        level: skillZone.level || "Junior",
        requiredSkills: skillZone.requiredSkills?.join(", ") || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        level: "Junior",
        requiredSkills: "",
      });
    }
  }, [skillZone, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    let success = false;
    if (skillZone) {
      success = await update(skillZone._id, payload, {
        successMessage: "Skill Zone updated successfully",
      });
    } else {
      success = await create(payload, {
        successMessage: "Skill Zone created",
      });
    }

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {skillZone ? "Edit Skill Zone" : "Add Skill Zone"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Zone Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select
                value={formData.level}
                onValueChange={(val) =>
                  setFormData({ ...formData, level: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Required Skills (comma separated)</Label>
            <Input
              placeholder="React, TypeScript, CSS"
              value={formData.requiredSkills}
              onChange={(e) =>
                setFormData({ ...formData, requiredSkills: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : skillZone ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
