"use client";

import { useEffect, useState } from "react";
import { JobForm } from "@/components/recruitment/JobForm";
import { apiRequest } from "@/utils/api";
import { Loader } from "@/components/ui/loader";
import { useParams } from "next/navigation";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiRequest("GET", `/recruitment/${id}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  if (!data) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Job Opening</h1>
        <p className="text-sm text-muted-foreground">
          Update recruitment details for {data.title}
        </p>
      </div>
      <JobForm initialData={data} isEdit />
    </div>
  );
}
