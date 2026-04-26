import { CheckCircle2, Circle, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandlordQuestionsChecklistProps {
  questions: string[];
  reviewedQuestionKeys: string[];
  onReviewedQuestionKeysChange: (keys: string[]) => void;
}

function getQuestionKey(question: string) {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

export const LandlordQuestionsChecklist = ({
  questions,
  reviewedQuestionKeys,
  onReviewedQuestionKeysChange,
}: LandlordQuestionsChecklistProps) => {
  const reviewedQuestions = new Set(reviewedQuestionKeys);
  const reviewedCount = questions.filter((question) =>
    reviewedQuestions.has(getQuestionKey(question)),
  ).length;

  const toggle = (question: string) => {
    const questionKey = getQuestionKey(question);
    const next = new Set(reviewedQuestionKeys);

    if (next.has(questionKey)) {
      next.delete(questionKey);
    } else {
      next.add(questionKey);
    }

    onReviewedQuestionKeysChange([...next]);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <MessageCircleQuestion className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Questions to ask your landlord
          </h3>
          <p className="text-sm text-muted-foreground">
            {reviewedCount} of {questions.length} reviewed
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {questions.map((q, i) => {
          const isDone = reviewedQuestions.has(getQuestionKey(q));
          return (
            <li key={`${getQuestionKey(q)}-${i}`}>
              <button
                onClick={() => toggle(q)}
                aria-pressed={isDone}
                className={cn(
                  "w-full text-left flex items-start gap-3 rounded-xl p-3 transition-base",
                  isDone
                    ? "bg-safe-soft hover:bg-safe-soft/80"
                    : "bg-secondary/40 hover:bg-secondary",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-safe mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                )}
                <span
                  className={cn(
                    "text-sm leading-relaxed",
                    isDone ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  {q}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
