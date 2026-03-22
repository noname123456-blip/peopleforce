"use client";

import { useEffect, useState } from "react";
import CreateAssetDialog from "@/components/assets/CreateAssetDialog";
import { Package, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchAssets = () => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAssets(d))
      .catch(() => {});
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a._id !== id));
  };

  const filtered = assets.filter((a) =>
    a.asset_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground">Manage company assets</p>
        </div>
        <CreateAssetDialog onSuccess={fetchAssets} />
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No assets found
            </CardContent>
          </Card>
        ) : (
          filtered.map((a: any) => (
            <Card key={a._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <Package className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.asset_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.asset_category_id?.asset_category_name} •{" "}
                      {a.asset_tracking_id || "No ID"} • $
                      {a.asset_purchase_cost?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      a.asset_status === "Available"
                        ? "default"
                        : a.asset_status === "In use"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {a.asset_status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(a._id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
