"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  const [threshold, setThreshold] = useState(50);
  const [autoReminders, setAutoReminders] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Admin Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
          <DialogDescription>
            Configure prediction parameters and automated actions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-reminders" className="flex flex-col space-y-1">
              <span>Auto-Reminders</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Automatically send reminders for at-risk patients.
              </span>
            </Label>
            <Switch 
              id="auto-reminders" 
              checked={autoReminders} 
              onCheckedChange={setAutoReminders}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
                <Label htmlFor="threshold">Risk Threshold</Label>
                <span className="text-sm font-medium">{threshold}%</span>
            </div>
            <Slider
              id="threshold"
              min={0}
              max={100}
              step={1}
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
            />
            <p className="text-xs text-muted-foreground">
                Set the probability threshold for classifying a patient as 'At Risk'.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
