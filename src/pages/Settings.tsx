import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DEFAULT_MONTHLY_BUDGET = "2000";

const Settings = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(DEFAULT_MONTHLY_BUDGET);

  useEffect(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    if (savedBudget) {
      setMonthlyBudget(savedBudget);
    }
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your LeaseLens experience.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Student" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="school">University</Label>
              <Input id="school" placeholder="e.g. UT Austin" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Budget</h2>

          <div className="space-y-1.5">
            <Label htmlFor="monthly-budget">Default monthly budget</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="monthly-budget"
                inputMode="numeric"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="2000"
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used to score affordability when analyzing a lease.
            </p>
          </div>
        </section>

        <Button
          onClick={() => {
            localStorage.setItem(
              "monthlyBudget",
              monthlyBudget.trim() || DEFAULT_MONTHLY_BUDGET,
            );
            toast.success("Budget saved");
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 px-6"
        >
          Save changes
        </Button>
      </div>
    </AppLayout>
  );
};

export default Settings;
