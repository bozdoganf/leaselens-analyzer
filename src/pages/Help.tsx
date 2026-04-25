import { MarketingLayout } from "@/layouts/MarketingLayout";
import { LifeBuoy, BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Is LeaseLens legal advice?",
    a: "No. LeaseLens is an educational tool that helps you understand and compare leases. For legal advice, consult an attorney or your campus housing office.",
  },
  {
    q: "Do you store my lease?",
    a: "Lease text you paste stays in your browser session for analysis. We do not persist it without your explicit action.",
  },
  {
    q: "How is the score calculated?",
    a: "We weigh four pillars: lease safety, affordability, location, and student fit. Each is scored 0–100 and combined into your overall housing risk score.",
  },
  {
    q: "Which file formats are supported?",
    a: "PDF, DOCX, and image uploads up to 10MB, or paste plain text directly into the analyzer.",
  },
];

const Help = () => (
  <MarketingLayout>
    <section className="container py-12">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
        Help Center
      </h1>
      <p className="text-muted-foreground mt-1 max-w-2xl">
        Answers to common questions, plus how to reach us if you're stuck.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { icon: BookOpen, title: "Getting started", text: "Walkthroughs for your first analysis." },
          { icon: LifeBuoy, title: "Troubleshooting", text: "Upload errors and unreadable PDFs." },
          { icon: MessageCircle, title: "Contact support", text: "We respond within one business day." },
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

      <div className="mt-10 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl font-extrabold text-foreground">Frequently asked</h2>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-foreground">
                {f.q}
                <span className="text-primary text-xl leading-none transition-base group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Still need help? <Link to="/support" className="text-primary font-semibold hover:underline">Contact support →</Link>
      </div>
    </section>
  </MarketingLayout>
);

export default Help;
