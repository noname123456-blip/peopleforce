"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Folder } from "lucide-react";

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    asset_category_name: "",
    asset_category_description: "",
  });

  useEffect(() => {
    fetch("/api/assets/categories")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCats(d))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/assets/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const c = await res.json();
      setCats((prev) => [c, ...prev]);
      setOpen(false);
      setForm({ asset_category_name: "", asset_category_description: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Asset Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage asset categories
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={form.asset_category_name}
                  onChange={(e) =>
                    setForm({ ...form, asset_category_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={form.asset_category_description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      asset_category_description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              No categories
            </CardContent>
          </Card>
        ) : (
          cats.map((c: any) => (
            <Card key={c._id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                    <Folder className="size-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {c.asset_category_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.asset_category_description || "No description"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
