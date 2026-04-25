import { Link } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SignIn = () => {
  return (
    <MarketingLayout>
      <section className="container py-16 max-w-md">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="font-display text-2xl font-extrabold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save analyses and compare leases across your search.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.info("Authentication is not enabled in this demo.");
            }}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.edu" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11"
            >
              Sign in
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            New to LeaseLens?{" "}
            <Link to="/upload" className="text-primary font-semibold hover:underline">
              Try it without an account →
            </Link>
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default SignIn;
