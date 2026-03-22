"use client";

import { JobForm } from "@/components/recruitment/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Post New Job</h1>
        <p className="text-sm text-muted-foreground">
          Create a new recruitment opening
        </p>
      </div>
      <JobForm />
    </div>
  );
}
