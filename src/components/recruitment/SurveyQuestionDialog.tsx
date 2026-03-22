"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdate } from "@/hooks/use-update";

interface SurveyQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  templateId: string | null;
  existingQuestions: any[];
}

export function SurveyQuestionDialog({
  open,
  onOpenChange,
  onSuccess,
  templateId,
  existingQuestions = [],
}: SurveyQuestionDialogProps) {
  const { update, loading } = useUpdate("/survey-templates");

  const [formData, setFormData] = useState({
    text: "",
    type: "text",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId) return;

    const payload = {
      questions: [...existingQuestions, formData],
    };

    const success = !!(await update(templateId, payload, {
      successMessage: "Question added successfully",
    }));

    if (success) {
      setFormData({ text: "", type: "text" }); // Reset
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Question Text *</Label>
            <Input
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Question Type</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="yes_no">Yes / No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading || !templateId}>
              {loading ? "Saving..." : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
