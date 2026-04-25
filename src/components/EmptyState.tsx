import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSampleClick: () => void;
}

export const EmptyState = ({ onSampleClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-secondary/30">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
        <FileText className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-1">
        Upload a lease or listing to get started.
      </h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm">
        Drop in a file or paste your lease text above to scan for risky clauses.
      </p>
      <Button
        onClick={onSampleClick}
        variant="outline"
        className="font-semibold border-primary/30 text-primary hover:bg-primary-soft"
      >
        Try Sample Lease
      </Button>
    </div>
  );
};
