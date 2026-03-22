"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headset } from "lucide-react";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/helpdesk/tickets")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTickets(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-sm text-muted-foreground">Your support tickets</p>
      </div>
      <div className="grid gap-3">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No tickets
            </CardContent>
          </Card>
        ) : (
          tickets.map((t: any) => (
            <Card key={t._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50">
                    <Headset className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.description?.substring(0, 60)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      t.priority === "critical" ? "destructive" : "secondary"
                    }
                  >
                    {t.priority}
                  </Badge>
                  <Badge variant="outline">{t.status?.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
