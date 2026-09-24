const campusStore = {
  navigation: [
    { label: "Home", target: "top" },
    { label: "Features", target: "features" },
    { label: "Dashboard", route: "/dashboard" },
  ],
  experienceCards: [
    {
      eyebrow: "One daily view",
      title: "Your day, finally together",
      description: "Classes, deadlines, announcements, and campus support meet in one calm workspace instead of five scattered tabs.",
      image: "https://plus.unsplash.com/premium_vector-1739262161806-d954eb02427c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
    },
    {
      eyebrow: "Role aware",
      title: "The right view for every role",
      description: "Students, faculty, department leaders, and placement teams each see the signals that matter without learning a new system.",
      image: "https://plus.unsplash.com/premium_vector-1739200616200-69a138d91627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
    },
    {
      eyebrow: "Opportunity",
      title: "Find the next move faster",
      description: "Discover opportunities, follow updates, and move from interest to action without losing the context that made it relevant.",
      image: "https://plus.unsplash.com/premium_vector-1738597190290-a3b571590b9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
    },
    {
      eyebrow: "Shared progress",
      title: "See momentum as it happens",
      description: "Clear progress snapshots replace status chasing and give everyone a shared picture of what is moving forward.",
      image: "https://plus.unsplash.com/premium_vector-1738935247245-97940c74cced?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
    },
  ],
  storySections: [
    {
      number: "01",
      label: "The day",
      headline: ["One place", "for every", "campus move."],
      copy: "CampusFlow brings the signals from your day into one clear rhythm, so attention stays on the work that matters.",
    },
    {
      number: "02",
      label: "Every role",
      headline: ["Learn.", "Teach.", "Belong."],
      copy: "A shared foundation with a focused workspace for every campus role.",
      stats: [
        ["Students", "Classes, deadlines, and support in one view."],
        ["Faculty", "Teaching, reviews, and attendance without the noise."],
        ["Leaders", "A clearer picture of progress across the campus."],
      ],
    },
    {
      number: "03",
      label: "The opportunity",
      headline: ["Less noise.", "More signal."],
      copy: "Find the people, events, and opportunities worth your time while the context stays attached.",
      stats: [
        ["One search", "Classes, campus updates, and opportunities."],
        ["Clear ownership", "Know what needs attention and why."],
        ["Faster handoffs", "Move work between people without losing context."],
      ],
    },
    {
      number: "04",
      label: "The next move",
      headline: ["Your campus", "in motion."],
      copy: "Start with the view you need today. CampusFlow grows with the way your role already works.",
    },
  ],
  features: [
    {
      title: "Unified dashboard",
      description: "See classes, deadlines, attendance, and campus updates in one focused workspace.",
      meta: "One daily view",
      theme: "oxfordNavy",
    },
    {
      title: "Role-based access",
      description: "Give students, faculty, leaders, and placement teams the tools they actually need.",
      meta: "Four workspaces",
      theme: "punchRed",
    },
    {
      title: "Academic progress",
      description: "Track submissions, attendance, performance, and the next deadline without chasing updates.",
      meta: "Always current",
      theme: "cerulean",
    },
    {
      title: "Campus opportunities",
      description: "Move from relevant opportunities to action while keeping the full context attached.",
      meta: "Find your next move",
      theme: "frostedBlue",
    },
    {
      title: "Announcements and events",
      description: "Keep important campus signals visible without turning them into another noisy feed.",
      meta: "Clear signals",
      theme: "honeydew",
    },
    {
      title: "Shared workflows",
      description: "Connect students, faculty, departments, and placement teams through clear handoffs.",
      meta: "One connected campus",
      theme: "oxfordNavy",
    },
  ],
  footerGroups: [
    { label: "Explore", links: ["Dashboard", "Attendance", "Assignments"] },
    { label: "For campus", links: ["Students", "Faculty", "Leadership"] },
    { label: "Support", links: ["Help center", "Privacy", "Contact"] },
  ],
};

export const useCampusStore = (selector) => selector(campusStore);
