"use client";

import type { AuditLogEntry } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileClock } from "lucide-react";

interface AuditLogProps {
  log: AuditLogEntry[];
}

export default function AuditLog({ log }: AuditLogProps) {
  const getBadgeVariant = (label: 'no-show' | 'attend'): 'destructive' | 'secondary' => {
      return label === 'no-show' ? 'destructive' : 'secondary';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <FileClock className="h-5 w-5"/>
            Recent Predictions
        </CardTitle>
        <CardDescription>A log of the 5 most recent predictions made.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Patient ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Risk</TableHead>
                    <TableHead className="text-right">Prediction</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {log.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No predictions have been made yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        log.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">{entry.id.substring(0, 8)}</TableCell>
                                <TableCell>{format(entry.timestamp, "PPp")}</TableCell>
                                <TableCell className="text-right font-medium">{(entry.prediction.probability * 100).toFixed(0)}%</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getBadgeVariant(entry.prediction.label)} className="w-[120px] justify-center">
                                        {entry.prediction.label === 'no-show' ? 'At Risk' : 'Likely to Attend'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
