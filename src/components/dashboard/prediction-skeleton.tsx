'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PredictionSkeletonProps {
  onCancel: () => void;
}

export default function PredictionSkeleton({ onCancel }: PredictionSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
        <Card>
            <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-[160px] w-[160px] rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                    <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div>
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-56" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>

        <div className="flex justify-center">
            <Button variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel Prediction
            </Button>
        </div>
    </div>
  );
}
