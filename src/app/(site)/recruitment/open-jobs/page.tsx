"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Building2,
  ExternalLink,
  Eye,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";

export default function OpenJobsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Fetch recruitments
  const { data: jobs, loading } = useList<any>("/recruitment", {
    initialFilters: { is_published: "true" },
  });

  const filtered =
    jobs?.filter(
      (j) =>
        !j.closed && // Only open jobs (server already filters is_published)
        (j.title?.toLowerCase().includes(search.toLowerCase()) ||
          j.job_position_id?.toLowerCase().includes(search.toLowerCase())),
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Open Jobs</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} active positions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-3.5" />
            Filter
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => router.push("/recruitment/jobs/new")}
          >
            <Plus className="size-3.5" />
            Post Job
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-muted-foreground">
          <Briefcase className="h-10 w-10 opacity-20" />
          <p>No open jobs found using your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <Card
              key={job._id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20"
              onClick={() => router.push(`/recruitment/jobs/${job._id}`)}
            >
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase className="size-5 text-primary" />
                  </div>
                  <Badge
                    className={cn(
                      "text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
                    )}
                  >
                    Active
                  </Badge>
                </div>

                <div className="mt-4 flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {typeof job.job_position_id === "string"
                      ? job.job_position_id
                      : job.job_position_id?.job_position || "Position N/A"}
                  </p>
                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Published
                    </span>
                    <span className="text-xs font-semibold">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-primary hover:text-primary hover:bg-primary/5"
                  >
                    <Eye className="size-3.5" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
