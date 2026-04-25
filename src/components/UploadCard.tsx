import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  leaseText: string;
  onLeaseTextChange: (text: string) => void;
  onSampleClick: () => void;
}

export const UploadCard = ({ leaseText, onLeaseTextChange, onSampleClick }: UploadCardProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (e) => onLeaseTextChange(String(e.target?.result ?? ""));
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed bg-secondary/50 p-10 text-center transition-base",
          dragActive
            ? "border-primary bg-primary-soft"
            : "border-border hover:border-primary/40 hover:bg-primary-soft/40",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.txt,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <FileUp className="h-5 w-5" />
          </div>
          <p className="text-base text-foreground">
            <span className="text-primary font-semibold">Choose File</span>{" "}
            <span className="text-muted-foreground">or drag and drop</span>
          </p>
          {fileName && (
            <p className="text-xs text-primary font-semibold">{fileName}</p>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          or paste lease text below
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Textarea
        id="lease-text"
        value={leaseText}
        onChange={(e) => onLeaseTextChange(e.target.value)}
        placeholder="Paste the full text of your lease agreement here..."
        className="min-h-[180px] resize-y text-sm leading-relaxed bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
      />

      <button
        type="button"
        onClick={onSampleClick}
        className="text-xs font-semibold text-primary hover:text-primary/80 transition-base"
      >
        ✨ Try Sample Lease →
      </button>
    </div>
  );
};
