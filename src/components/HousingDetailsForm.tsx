import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import type { HousingDetails, UtilitiesIncluded } from "@/lib/types";

interface HousingDetailsFormProps {
  details: HousingDetails;
  onChange: (details: HousingDetails) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const HousingDetailsForm = ({
  details,
  onChange,
  onSubmit,
  disabled,
}: HousingDetailsFormProps) => {
  const update = <K extends keyof HousingDetails>(key: K, value: HousingDetails[K]) =>
    onChange({ ...details, [key]: value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rent">Monthly Rent</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              id="rent"
              inputMode="numeric"
              value={details.monthlyRent}
              onChange={(e) => update("monthlyRent", e.target.value)}
              placeholder="0"
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            inputMode="numeric"
            value={details.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="neighborhood">Neighborhood / City</Label>
        <Input
          id="neighborhood"
          value={details.neighborhood}
          onChange={(e) => update("neighborhood", e.target.value)}
          placeholder="e.g. University District"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="commute">Daily Commute (Mins)</Label>
        <Input
          id="commute"
          inputMode="numeric"
          value={details.commuteMinutes}
          onChange={(e) => update("commuteMinutes", e.target.value)}
          placeholder="15"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="utilities">Utilities Included</Label>
        <Select
          value={details.utilitiesIncluded}
          onValueChange={(v) => update("utilitiesIncluded", v as UtilitiesIncluded)}
        >
          <SelectTrigger id="utilities">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">All included</SelectItem>
            <SelectItem value="no">None</SelectItem>
            <SelectItem value="unknown">Unknown / Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label
        htmlFor="car"
        className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3.5 cursor-pointer hover:bg-secondary transition-base"
      >
        <Checkbox
          id="car"
          checked={details.hasCar}
          onCheckedChange={(v) => update("hasCar", Boolean(v))}
          className="mt-0.5"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">I have a car</p>
          <p className="text-xs text-muted-foreground">Needs parking clause review</p>
        </div>
      </label>

      <Button
        type="submit"
        disabled={disabled}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-11 shadow-soft"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Analyze Housing Risk
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Our analysis is educational and is not a substitute for legal advice.
      </p>
    </form>
  );
};
