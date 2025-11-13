
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import HistoryChart from "@/components/dashboard/history-chart";
import { useState } from "react";
import type { AuditLogEntry } from "@/lib/types";
import { subDays } from "date-fns";
import NoData from "@/components/dashboard/no-data";

// Generate more realistic mock data for the chart
const generateMockData = (): AuditLogEntry[] => {
    const data: AuditLogEntry[] = [];
    let lastProb = 0.5;
    for (let i = 30; i >= 0; i--) {
        const timestamp = subDays(new Date(), i);
        const fluctuation = (Math.random() - 0.5) * 0.2;
        const trend = (15-i)/30 * 0.1; // Add a slight downward trend
        const probability = Math.max(0, Math.min(1, lastProb + fluctuation + trend));
        lastProb = probability;
        
        data.push({
            id: `P${1000 + i}`,
            timestamp,
            prediction: {
                probability,
                label: probability > 0.5 ? 'no-show' : 'attend',
                top_features: [],
                recommended_action: '',
                explanation_html: ''
            }
        });
    }
    return data;
};


export default function HistoryPage() {
    const [historyData] = useState<AuditLogEntry[]>(generateMockData());

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Prediction History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>No-Show Risk Over Time</CardTitle>
                    <CardDescription>
                        This chart displays the predicted no-show probability for patients over the last 30 days.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {historyData.length > 0 ? (
                        <div className="h-[400px]">
                            <HistoryChart data={historyData} />
                        </div>
                    ) : (
                       <div className="h-[400px]">
                         <NoData />
                       </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
