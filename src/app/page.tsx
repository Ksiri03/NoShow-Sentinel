'use client';

import { useState } from 'react';
import type { ExplainablePredictionOutput } from '@/ai/flows/explainable-prediction';
import { explainablePrediction } from '@/ai/flows/explainable-prediction';
import type { PredictionFormValues } from '@/lib/schema';
import PredictionForm from '@/components/dashboard/prediction-form';
import PredictionResults from '@/components/dashboard/prediction-results';
import PredictionSkeleton from '@/components/dashboard/prediction-skeleton';
import { useToast } from '@/hooks/use-toast';
import type { AuditLogEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import NoData from '@/components/dashboard/no-data';

export default function DashboardPage() {
  const [prediction, setPrediction] = useState<ExplainablePredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handlePredict = async (data: PredictionFormValues) => {
    setIsLoading(true);
    setPrediction(null);

    try {
      const input = {
        ...data,
        scheduled_iso: data.scheduled_iso?.toISOString() ?? new Date().toISOString(),
        appointment_iso: data.appointment_iso?.toISOString() ?? new Date().toISOString(),
      };
      const result = await explainablePrediction(input);
      setPrediction(result);

      setAuditLog(prevLog => [
        {
          id: data.patient_id || new Date().toISOString(),
          timestamp: new Date(),
          prediction: result,
        },
        ...prevLog
      ].slice(0, 5));

    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Prediction Error",
        description: "There was an error generating the prediction. Please try again.",
        variant: "destructive",
      });
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(false);
    toast({
      title: "Prediction Canceled",
      description: "The prediction request has been canceled.",
    });
  }

  const renderForm = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">NoShow Sentinel</CardTitle>
        <CardDescription className="pt-2 text-base">
          Enter patient details below to predict their appointment no-show risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PredictionForm
          onSubmit={handlePredict}
          isLoading={isLoading}
          key={prediction ? 'form-with-prediction' : 'initial-form'}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {isMobile ? (
        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h2 className="text-lg font-semibold">Prediction Form</h2>
              </AccordionTrigger>
              <AccordionContent>
                {renderForm()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <main>
            <h1 className="text-3xl font-bold tracking-tight mb-6">Prediction Analysis</h1>
            {isLoading && <PredictionSkeleton onCancel={handleCancel} />}
            {!isLoading && prediction && (
              <PredictionResults prediction={prediction} auditLog={auditLog} handlePredict={handlePredict} />
            )}
            {!isLoading && !prediction && <NoData />}
          </main>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 sticky top-8 self-start">
            {renderForm()}
          </div>
          <main className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Prediction Analysis</h1>
            {isLoading && <PredictionSkeleton onCancel={handleCancel} />}
            {!isLoading && prediction && (
              <PredictionResults prediction={prediction} auditLog={auditLog} handlePredict={handlePredict} />
            )}
            {!isLoading && !prediction && <NoData />}
          </main>
        </div>
      )}
    </div>
  );
}
