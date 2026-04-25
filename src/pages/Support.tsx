import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LifeBuoy, Mail, Clock } from "lucide-react";

const Support = () => (
  <AppLayout>
    <div className="mb-8">
      <h1 className="font-display text-3xl font-extrabold text-foreground">Support</h1>
      <p className="text-muted-foreground mt-1">We typically reply within one business day.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
      <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Send us a message</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent — we'll be in touch soon.");
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Your email</Label>
            <Input id="email" type="email" placeholder="you@school.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" placeholder="e.g. Trouble uploading PDF" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={6} placeholder="Tell us what's going on…" required />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 px-6"
          >
            Send message
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {[
          { icon: LifeBuoy, title: "Demo mode", text: "Submissions aren't routed in this prototype." },
          { icon: Mail, title: "support@leaselens.app", text: "Direct email line for urgent issues." },
          { icon: Clock, title: "Response time", text: "Usually under 24 hours on weekdays." },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="font-display font-bold text-foreground">{c.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Support;
