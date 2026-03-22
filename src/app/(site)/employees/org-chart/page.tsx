"use client";

import { PageHeader } from "@/components/ui/page-header";
import { OrgChartBuilder } from "@/components/employees/OrgChartBuilder";

export default function OrgChartPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Chart"
        description="View and manage the company hierarchy"
      />

      <OrgChartBuilder />
    </div>
  );
}
