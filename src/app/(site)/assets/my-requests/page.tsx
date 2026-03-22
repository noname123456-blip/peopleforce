"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import RequestAssetDialog from "@/components/assets/RequestAssetDialog";

export default function MyAssetRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    fetch("/api/assets/requests")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setRequests(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Requests</h1>
          <p className="text-sm text-muted-foreground">Your recent asset requests</p>
        </div>
        <RequestAssetDialog onSuccess={fetchRequests} />
      </div>

      <div className="grid gap-3">
        {loading ? (
             <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    Loading your requests...
                </CardContent>
            </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No requests found. Click "New Request" to get started.
            </CardContent>
          </Card>
        ) : (
          requests.map((r: any) => (
            <Card key={r._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/50">
                    <Package className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {r.asset_category_id?.asset_category_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.description} • requested on {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    r.status === "approved"
                      ? "default"
                      : r.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {r.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
