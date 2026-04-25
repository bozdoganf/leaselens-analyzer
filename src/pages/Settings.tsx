import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => (
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
            <Label htmlFor="school">School</Label>
            <Input id="school" placeholder="e.g. UT Austin" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Preferences</h2>
        <div className="space-y-4">
          {[
            { id: "p1", label: "Email me when a new risk pattern is detected", checked: true },
            { id: "p2", label: "Include weekly market insight summary", checked: false },
            { id: "p3", label: "Show advanced lease terminology tooltips", checked: true },
          ].map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4">
              <Label htmlFor={p.id} className="text-sm font-medium text-foreground">
                {p.label}
              </Label>
              <Switch id={p.id} defaultChecked={p.checked} />
            </div>
          ))}
        </div>
      </section>

      <Button
        onClick={() => toast.success("Settings saved")}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 px-6"
      >
        Save changes
      </Button>
    </div>
  </AppLayout>
);

export default Settings;
