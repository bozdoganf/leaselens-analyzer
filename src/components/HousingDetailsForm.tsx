import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, BedDouble, Clock, Sparkles } from "lucide-react";
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
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Housing details</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          A few quick details help us tailor your risk score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rent">Monthly rent</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="rent"
              inputMode="numeric"
              value={details.monthlyRent}
              onChange={(e) => update("monthlyRent", e.target.value)}
              placeholder="1050"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="neighborhood">Neighborhood / area</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="neighborhood"
              value={details.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              placeholder="West Campus"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="bedrooms"
              inputMode="numeric"
              value={details.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              placeholder="2"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="commute">Commute to campus (minutes)</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="commute"
              inputMode="numeric"
              value={details.commuteMinutes}
              onChange={(e) => update("commuteMinutes", e.target.value)}
              placeholder="18"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="utilities">Utilities included</Label>
          <Select
            value={details.utilitiesIncluded}
            onValueChange={(v) => update("utilitiesIncluded", v as UtilitiesIncluded)}
          >
            <SelectTrigger id="utilities">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="car">Do you have a car?</Label>
          <div className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3">
            <span className="text-sm text-muted-foreground">
              {details.hasCar ? "Yes, I have a car" : "No, I don't"}
            </span>
            <Switch
              id="car"
              checked={details.hasCar}
              onCheckedChange={(v) => update("hasCar", v)}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={disabled}
        size="lg"
        className="w-full bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold shadow-card text-base h-12"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Analyze Housing Risk
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        LeaseLens is an educational tool and does not provide legal advice.
      </p>
    </form>
  );
};
