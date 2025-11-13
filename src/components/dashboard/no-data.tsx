
import { FileQuestion } from "lucide-react";

export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center rounded-xl border-2 border-dashed bg-card/50">
      <FileQuestion className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <div className="text-2xl font-bold text-muted-foreground">
        Awaiting Patient Data
      </div>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        Your results will appear here once you fill out the form and submit the patient data for prediction.
      </p>
    </div>
  );
}
