import { useRef, useState } from "react";
import { Upload, FileText, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
      <div>
        <Label className="text-sm font-semibold text-foreground mb-2 block">
          Upload lease, listing, or screenshot
        </Label>
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
          className={cn(
            "relative rounded-2xl border-2 border-dashed bg-gradient-to-b from-primary-soft/50 to-background p-8 text-center transition-base",
            dragActive
              ? "border-primary bg-primary-soft scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-primary-soft/30",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {fileName ? <FileImage className="h-7 w-7" /> : <Upload className="h-7 w-7" />}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {fileName ? fileName : "Drag & drop a file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PNG, JPG, PDF, or pasted text
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="font-semibold border-primary/30 text-primary hover:bg-primary-soft hover:text-primary"
            >
              Choose File
            </Button>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or paste lease text below
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div>
        <Label htmlFor="lease-text" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Lease or listing text
        </Label>
        <Textarea
          id="lease-text"
          value={leaseText}
          onChange={(e) => onLeaseTextChange(e.target.value)}
          placeholder="Paste lease or rental listing text here..."
          className="min-h-[160px] resize-y text-sm leading-relaxed bg-secondary/40 border-border focus:bg-background"
        />
        <button
          type="button"
          onClick={onSampleClick}
          className="mt-2 text-xs font-semibold text-primary hover:text-primary-glow transition-base"
        >
          ✨ Try Sample Lease →
        </button>
      </div>
    </div>
  );
};
