import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CompareTable } from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { COMPARE_OPTIONS } from "@/lib/mockAnalysis";
import { ArrowLeft, Plus } from "lucide-react";

const Compare = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 md:py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-base mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
              Compare your housing options
            </h1>
            <p className="text-muted-foreground mt-1">
              Side-by-side scores, rent, and risks to help you pick the right place.
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold shadow-card"
          >
            <Plus className="h-4 w-4 mr-2" />
            Analyze new lease
          </Button>
        </div>

        <CompareTable options={COMPARE_OPTIONS} />

        <p className="text-xs text-center text-muted-foreground pt-4">
          Sample comparison data shown for demo purposes. Each analysis is independent.
        </p>
      </main>
    </div>
  );
};

export default Compare;
