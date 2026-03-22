"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Briefcase,
  Users,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { useDelete } from "@/hooks/use-delete";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { delete: deleteJob } = useDelete("/recruitment");

  useEffect(() => {
    if (!id) return;
    apiRequest("GET", `/recruitment/${id}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job?")) {
      const success = await deleteJob(id);
      if (success) router.push("/recruitment/jobs");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader />
      </div>
    );
  if (!data) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/recruitment/jobs/${id}/edit`)}
          >
            <Edit className="size-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {data.title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={data.closed ? "secondary" : "default"}>
                      {data.closed ? "Closed" : "Open"}
                    </Badge>
                    {data.is_published && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Published
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
                  {data.description}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="font-medium text-sm">
                    {data.job_position_id?.job_position || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Vacancies</p>
                  <p className="font-medium text-sm">{data.vacancy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium text-sm">
                    {formatDate(data.start_date)}
                  </p>
                </div>
              </div>
              {data.end_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Closing Date
                    </p>
                    <p className="font-medium text-sm">
                      {formatDate(data.end_date)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hiring Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.recruitment_managers?.length > 0 ? (
                  data.recruitment_managers.map((m: any) => (
                    <Badge key={m._id} variant="secondary">
                      {m.employee_first_name} {m.employee_last_name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No managers assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
