import {
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Megaphone,
  Workflow,
} from "lucide-react";

const features = [
  { icon: LayoutDashboard, title: "Unified dashboard", description: "See classes, deadlines, attendance, and campus updates in one focused workspace." },
  { icon: ShieldCheck, title: "Role-based access", description: "Students, faculty, leaders, and placement teams each see the signals that matter." },
  { icon: TrendingUp, title: "Academic progress", description: "Track submissions, attendance, and performance without chasing updates." },
  { icon: Briefcase, title: "Campus opportunities", description: "Move from relevant opportunities to action while keeping context attached." },
  { icon: Megaphone, title: "Announcements and events", description: "Keep important campus signals visible without another noisy feed." },
  { icon: Workflow, title: "Shared workflows", description: "Connect students, faculty, and placement teams through clear handoffs." },
];

export default function Features() {
  return (
    <section id="features" className="bg-background px-6 py-20">
      <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl font-bold tracking-tighter">
        Everything campus life needs
      </h2>
      <p className="mt-3 text-center text-lg text-muted-foreground sm:text-2xl">
        One connected platform for academics, communication, and opportunity
      </p>
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div className="flex flex-col rounded-xl border bg-card p-8" key={feature.title}>
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <feature.icon className="size-5 text-secondary" />
            </div>
            <span className="font-heading text-lg font-bold">{feature.title}</span>
            <p className="mt-1 text-[15px] text-foreground/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
