import { Settings2, Command, Plus, Briefcase, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";

const IntegrationCard = () => (
  <Card className="flex h-full flex-col">
    <CardHeader>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
        <Briefcase className="size-6" />
      </div>
      <CardTitle>Placement & drives hub</CardTitle>
      <CardDescription>
        Every recruiting signal in one place. Companies, drives, rounds, and
        offers sync automatically so no application slips through.
      </CardDescription>
    </CardHeader>
    <CardFooter className="mt-auto flex items-center justify-between">
      <Button variant="ghost"><Settings2 className="mr-2 h-4 w-4" />Configure</Button>
      <Switch aria-label="Toggle integration" defaultChecked />
    </CardFooter>
  </Card>
);

const TrackersCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between gap-6">
      <div>
        <CardTitle className="text-base font-medium">Trackers Connected</CardTitle>
        <CardDescription>03 active modules</CardDescription>
      </div>
      <div className="flex -space-x-2 overflow-hidden">
        {["S", "F", "P"].map((l) => (
          <span key={l} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground ring-2 ring-background">{l}</span>
        ))}
      </div>
    </CardContent>
  </Card>
);

const FocusCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between gap-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base font-medium">Today's focus</CardTitle>
          <CardDescription>Attendance analytics</CardDescription>
        </div>
        <Badge variant="secondary">Range Ratio</Badge>
      </div>
      <div><span className="font-heading text-6xl font-bold">42%</span></div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Maximum of focus</span>
        <span>Monthly Focus</span>
      </div>
    </CardContent>
  </Card>
);

const StatisticCard = () => (
  <Card className="relative h-full w-full overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#c3d7ec 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
    <CardContent className="relative z-10 flex h-full items-center justify-center">
      <span className="font-heading text-8xl font-bold leading-none text-foreground/90">10X</span>
    </CardContent>
  </Card>
);

const ProductivityCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-end gap-3">
      <CardTitle className="text-base font-medium">Team's productivity</CardTitle>
      <CardDescription>Clear handoffs between students, faculty, and placement teams.</CardDescription>
    </CardContent>
  </Card>
);

const ShortcutsCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-wrap items-center justify-between gap-4">
      <div>
        <CardTitle className="text-base font-medium">Shortcut keys</CardTitle>
        <CardDescription>Faster access to every dashboard.</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-background font-mono text-xs text-muted-foreground"><Command className="h-3 w-3" /></div>
        <Plus className="h-3 w-3 text-muted-foreground" />
        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-background font-mono text-xs text-muted-foreground">M</div>
      </div>
    </CardContent>
  </Card>
);

export default function BentoFeatures() {
  return (
    <div className="w-full p-4 md:p-10">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
          <Sparkles className="size-4" />
          Built for campus
        </span>
        <h2 className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Product Features</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Organize, prioritize and track campus work efficiently in one trusted platform</p>
      </div>
      <BentoGridShowcase
        integration={<IntegrationCard />}
        trackers={<TrackersCard />}
        statistic={<StatisticCard />}
        focus={<FocusCard />}
        productivity={<ProductivityCard />}
        shortcuts={<ShortcutsCard />}
      />
    </div>
  );
}
