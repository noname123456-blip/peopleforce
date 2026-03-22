"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";

import { Loader2, Upload, FileText, X } from "lucide-react";
import { useCreate } from "@/hooks/use-create";
import { useList } from "@/hooks/use-list";
import { notify } from "@/utils/notifications";
import { apiRequest } from "@/utils/api";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: UploadDocumentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    document_type: "",
    employee_id: "",
    priority: "normal",
    notes: "",
    file_url: "",
  });

  const { create, loading: creating } = useCreate("/documents");

  // Fetch employees for dropdown
  const { data: employees } = useList<any>("/employees", { defaultLimit: 100 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      notify.error("Please select a file");
      return;
    }

    if (!formData.employee_id) {
      notify.error("Please select an employee");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload File
      const uploadData = new FormData();
      uploadData.append("file", file);

      const uploadRes = await apiRequest("POST", "/upload", uploadData, {
        showSuccess: false,
        showError: true,
      });

      if (!uploadRes.url) throw new Error("Upload failed");

      // 2. Create Document Record
      await create(
        {
          ...formData,
          file_url: uploadRes.url,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          request_date: new Date().toISOString(),
          status: "pending", // Default status
        },
        {
          successMessage: "Document uploaded successfully",
        },
      );

      setFile(null);
      setFormData({
        title: "",
        document_type: "",
        employee_id: "",
        priority: "Normal",
        notes: "",
        file_url: "",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      // specific errors handled by apiRequest or create
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document for an employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Employment Contract"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select
                value={formData.document_type}
                onValueChange={(val) =>
                  setFormData({ ...formData, document_type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="slip">Slip</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(val) =>
                  setFormData({ ...formData, priority: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select
              value={formData.employee_id}
              onValueChange={(val) =>
                setFormData({ ...formData, employee_id: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {employees.map((emp: any) => (
                  <SelectItem key={emp._id} value={emp._id}>
                    {emp.employee_first_name} {emp.employee_last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>File Attachment *</Label>
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
              >
                <Upload className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload file</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, Word, Excel, Images, CSV up to 10MB
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setFile(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv,.txt,.ppt,.pptx"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional notes..."
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || creating}>
              {(uploading || creating) && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {uploading
                ? "Uploading..."
                : creating
                  ? "Saving..."
                  : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
