"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming it exists
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";
// import { DatePicker } from "@/components/ui/date-picker"; // Assuming date picker? Or just input type=date

interface JobFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function JobForm({ initialData, isEdit = false }: JobFormProps) {
  const router = useRouter();
  const { create, loading: creating } = useCreate("/recruitment");
  const { update, loading: updating } = useUpdate("/recruitment");

  const { data: positions } = useList<any>("/job-positions"); // Need to verify API route
  const { data: employees } = useList<any>("/employees");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    job_position_id: "",
    vacancy: 1,
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    is_published: true,
    recruitment_managers: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        job_position_id: initialData.job_position_id || "",
        vacancy: initialData.vacancy || 1,
        start_date: initialData.start_date
          ? new Date(initialData.start_date).toISOString().split("T")[0]
          : "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
        is_published: initialData.is_published ?? true,
        recruitment_managers:
          initialData.recruitment_managers?.map((m: any) => m._id || m) || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    let result = null;
    if (isEdit && initialData?._id) {
      result = await update(initialData._id, payload, {
        successMessage: "Job updated successfully",
      });
    } else {
      result = await create(payload, {
        successMessage: "Job posted successfully",
      });
    }

    if (result) {
      router.push("/recruitment/jobs");
    }
  };

  const loading = creating || updating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Job Opening" : "Post a New Job"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Job Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Job Position *</Label>
              <Input
                placeholder="Manager, Developer, etc."
                value={formData.job_position_id}
                onChange={(e) =>
                  setFormData({ ...formData, job_position_id: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Vacancies</Label>
              <Input
                type="number"
                min={1}
                value={formData.vacancy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vacancy: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_published: checked })
              }
            />
            <Label>Publish Immediately</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
