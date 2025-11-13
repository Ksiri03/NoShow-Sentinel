"use client";

import React, { useState } from "react";
import type { ExplainablePredictionOutput } from "@/ai/flows/explainable-prediction";
import type { AuditLogEntry } from "@/lib/types";
import ProgressRing from "./progress-ring";
import AuditLog from "./audit-log";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, ArrowUpRight, ArrowDownRight, Lightbulb, SlidersHorizontal, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import PredictionForm from "./prediction-form";
import type { PredictionFormValues } from "@/lib/schema";
import { predictionSchema } from "@/lib/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictionResultsProps {
  prediction: ExplainablePredictionOutput;
  auditLog: AuditLogEntry[];
  handlePredict: (data: PredictionFormValues) => void;
}

export default function PredictionResults({ prediction, auditLog, handlePredict }: PredictionResultsProps) {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  
  const initialSimValuesFromAudit = auditLog.find(entry => entry.id === (prediction.patient_id || ''));
  
  const formValues: Partial<PredictionFormValues> = initialSimValuesFromAudit ? {
    patient_id: initialSimValuesFromAudit.id,
    age: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'age')?.contribution,
    gender: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'gender')?.contribution ? 'female' : 'male',
    sms_received: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'sms_received')?.contribution ? true : false,
    comorb_count: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'comorb_count')?.contribution,
    neighbourhood: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'neighbourhood')?.contribution?.toString(),
    past_no_shows: initialSimValuesFromAudit.prediction.top_features.find(f => f.name.toLowerCase() === 'past_no_shows')?.contribution,
    scheduled_iso: new Date(),
    appointment_iso: new Date(),
  } : {};
  
  const [simValues, setSimValues] = useState<Partial<PredictionFormValues>>(formValues);

  const debouncedSimValues = useDebounce(simValues, 500);

  React.useEffect(() => {
    if (isSimulating && debouncedSimValues) {
        const result = predictionSchema.safeParse(debouncedSimValues);
        if (result.success) {
            handlePredict(result.data);
        } else {
            console.error("Simulation form validation error:", result.error);
        }
    }
  }, [debouncedSimValues, isSimulating, handlePredict]);

  const riskLabel = prediction.label === 'no-show' ? 'At Risk of No-Show' : 'Likely to Attend';
  const riskProbability = prediction.probability * 100;

  const getConfidence = (prob: number): {level: 'Low' | 'Medium' | 'High', color: string} => {
    const certainty = Math.abs(prob - 0.5) * 2;
    if (certainty > 0.8) return {level: 'High', color: 'bg-green-500'};
    if (certainty > 0.4) return {level: 'Medium', color: 'bg-yellow-500'};
    return {level: 'Low', color: 'bg-red-500'};
  }
  
  const confidence = getConfidence(prediction.probability);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(prediction, null, 2));
    toast({ title: "Copied to clipboard!", description: "Prediction data in JSON format has been copied." });
  };
  
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardContent className="pt-6 flex flex-col lg:flex-row items-center justify-around gap-6 lg:gap-12">
            <ProgressRing progress={riskProbability} />
            <div className="w-full lg:w-2/3 space-y-4 text-center lg:text-left">
                <Badge variant={prediction.label === 'no-show' ? 'destructive' : 'secondary'} className="text-base px-4 py-1">
                    {riskLabel}
                </Badge>
                
                <Alert className={cn(
                    "text-left",
                    prediction.label === 'no-show' 
                    ? "border-destructive/50 text-destructive dark:text-destructive-foreground [&>svg]:text-destructive" 
                    : "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600"
                )}>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Recommended Action</AlertTitle>
                    <AlertDescription>
                        {prediction.recommended_action}
                    </AlertDescription>
                </Alert>

                <div className="flex items-center gap-2 justify-center lg:justify-start pt-2">
                    <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-1.5">
                        <span className={cn("w-2.5 h-2.5 rounded-full", confidence.color)}></span>
                        <span className="text-sm font-semibold">{confidence.level}</span>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Key Factors</CardTitle>
                <CardDescription>Top features influencing this prediction.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {prediction.top_features.map(feature => (
                        <div key={feature.name} className="flex justify-between items-center text-sm p-3 rounded-lg bg-muted/60">
                           <div className="flex items-center gap-2 font-medium">
                               {feature.contribution > 0 ? <ArrowUpRight className="h-4 w-4 text-destructive"/> : <ArrowDownRight className="h-4 w-4 text-green-600"/>}
                               <span>{feature.name}</span>
                           </div>
                           <span className={cn("font-semibold text-base", feature.contribution > 0 ? 'text-destructive' : 'text-green-600')}>
                                {feature.contribution > 0 ? '+' : ''}{(feature.contribution * 100).toFixed(1)}%
                           </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                Prediction Explanation
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This explanation is AI-generated based on the prediction model's output.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardTitle>
             <CardDescription>An AI-generated summary of the prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto rounded-lg border p-4 bg-muted/60"
              dangerouslySetInnerHTML={{ __html: prediction.explanation_html }} 
            />
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5"/>
                    Simulation Mode
                </CardTitle>
                <CardDescription>Tweak inputs to see how they affect the prediction in real-time.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="simulation-mode">Live Update</Label>
                <Switch id="simulation-mode" checked={isSimulating} onCheckedChange={setIsSimulating} />
            </div>
        </CardHeader>
        {isSimulating && (
            <CardContent>
               <PredictionForm 
                    onSubmit={handlePredict} 
                    isLoading={false} 
                    initialValues={simValues}
                    onValuesChange={(values) => setSimValues(values)} 
                />
            </CardContent>
        )}
      </Card>

      <AuditLog log={auditLog} />

      <div className="flex items-center justify-end gap-2 pt-4">
        <Button variant="outline" onClick={copyJson}><Copy className="w-4 h-4 mr-2" /> Copy JSON</Button>
        <Button variant="outline" onClick={() => toast({title: "Coming Soon!", description: "PDF downloads will be available in a future update."})}><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
      </div>
    </div>
  );
}
