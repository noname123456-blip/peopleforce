"use client";

import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Briefcase,
  Users,
  CalendarCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/utils/api";

interface Recruitment {
  _id: string;
  title?: string;
  description?: string;
  vacancy?: number;
  closed?: boolean;
  is_published?: boolean;
  start_date?: string;
  end_date?: string;
  job_position_id?: { job_position?: string } | null;
}

function fmtDate(val?: string) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return val;
  }
}

export default function RecruitmentDashboardPage() {
  const [data, setData] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    apiRequest("GET", "/recruitment")
      .then((json) => setData(json.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.title || "").toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q)
    );
  });

  const totalVacancies = data.reduce((sum, r) => sum + (r.vacancy || 0), 0);
  const openCount = data.filter((r) => !r.closed).length;
  const publishedCount = data.filter((r) => r.is_published).length;

  const chartData = data.slice(0, 8).map((r) => ({
    name: (r.title || "Untitled").slice(0, 15),
    vacancies: r.vacancy || 0,
  }));

  const statCards = [
    {
      title: "Open Positions",
      value: openCount,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Vacancies",
      value: totalVacancies,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950",
    },
    {
      title: "Published",
      value: publishedCount,
      icon: CalendarCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Recruitment Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage open positions and hiring pipeline
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl",
                  s.bg,
                )}
              >
                <s.icon className={cn("size-6", s.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12" /> : s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : chartData.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vacancies by Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="vacancies"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search openings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Vacancies</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length ? (
                filtered.map((r) => (
                  <TableRow
                    key={r._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{r.title || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {r.description || ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {r.vacancy || 0}
                    </TableCell>
                    <TableCell className="text-sm">
                      {fmtDate(r.start_date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          r.is_published
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
                        )}
                      >
                        {r.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <UserPlus className="size-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        No recruitment openings found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
