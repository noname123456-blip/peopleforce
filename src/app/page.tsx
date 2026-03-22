"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Star,
  Menu,
  X,
} from "lucide-react";

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    const el = document.getElementById("stats-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return count;
}

/* ─── Data ─── */
const features = [
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Complete employee lifecycle — profiles, documents, organization charts, and role management.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: UserPlus,
    title: "Recruitment",
    description:
      "Post jobs, track candidates through your pipeline, and schedule interviews seamlessly.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: ClipboardList,
    title: "Onboarding",
    description:
      "Automated onboarding stages, task checklists, and new-hire progress tracking.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    description:
      "Real-time check-in/out, hour accounts, and comprehensive attendance reports.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: CalendarDays,
    title: "Leave Management",
    description:
      "Leave types, request workflows, balance tracking, and one-click approvals.",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: LogOut,
    title: "Offboarding",
    description:
      "Structured exit processes, resignation handling, and smooth knowledge transfers.",
    gradient: "from-indigo-500 to-blue-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Sign Up & Configure",
    desc: "Create your workspace and set up departments, roles, and policies in minutes.",
  },
  {
    num: "02",
    title: "Add Your Team",
    desc: "Import or manually create employees with all their details and documents.",
  },
  {
    num: "03",
    title: "Manage Everything",
    desc: "Track attendance, handle leave, run recruitment, and onboard new hires — all in one place.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "HR Director at TechCorp",
    text: "PeopleForce transformed how we manage our 500+ employees. The interface is incredibly intuitive.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "CEO at StartupHub",
    text: "We went from spreadsheets to a fully automated HR system in a single afternoon. Game changer.",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "People Ops at DesignStudio",
    text: "The recruitment pipeline alone saves us 20 hours a week. The onboarding automation is brilliant.",
    rating: 5,
    avatar: "ER",
  },
];

/* ─── Component ─── */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const employeeCount = useCounter(50000);
  const companyCount = useCounter(10000);
  const satisfactionRate = useCounter(99);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              PF
            </div>
            <span className="text-lg font-bold tracking-tight">
              PeopleForce
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/Login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/Signup"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-2 fade-in-0">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-sm font-medium py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenu(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-sm font-medium py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenu(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block text-sm font-medium py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenu(false)}
              >
                Testimonials
              </a>
              <div className="flex gap-2 pt-2">
                <Link
                  href="/Login"
                  className="flex-1 text-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/Signup"
                  className="flex-1 text-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in-up">
            <Sparkles className="size-4" />
            <span>The future of HR management is here</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Manage your people
            <br />
            <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            PeopleForce unifies employee management, recruitment, attendance,
            leave, onboarding, and offboarding into one beautiful, blazing-fast
            platform.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/Signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/Login"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm px-8 py-4 text-base font-semibold transition-all hover:bg-accent hover:border-primary/30"
            >
              Sign in
              <ChevronRight className="size-5" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-500" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-blue-500" />
              <span>Used Worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section
        id="stats-section"
        className="py-16 border-y border-border/50 bg-muted/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {employeeCount.toLocaleString()}+
              </p>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                Employees Managed
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {companyCount.toLocaleString()}+
              </p>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                Companies Worldwide
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {satisfactionRate}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                Customer Satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <LayoutDashboard className="size-4" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need,{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                nothing you don&apos;t
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Six powerful modules working together to streamline every aspect
              of your HR operations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, gradient }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
              >
                <div
                  className={`inline-flex size-12 items-center justify-center rounded-xl bg-linear-to-br ${gradient} text-white shadow-lg mb-5`}
                >
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Zap className="size-4" />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Up and running in{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                three steps
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center group">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-linear-to-r from-primary/30 to-primary/10" />
                )}
                <div className="inline-flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold shadow-xl shadow-primary/20 mb-6 transition-transform group-hover:scale-110">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Star className="size-4" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Loved by HR teams{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                everywhere
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-3xl bg-linear-to-br from-primary to-primary/80 p-12 md:p-16 text-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">
                Ready to transform your HR?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Join thousands of companies that trust PeopleForce to manage
                their most valuable asset — their people.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/Signup"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-xl transition-all hover:bg-white/90 hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="size-5" />
                  Get started for free
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/Login"
                  className="inline-flex items-center rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border/50 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold">
                  PF
                </div>
                <span className="text-base font-bold">PeopleForce</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The all-in-one HR platform for modern companies. Simplify your
                people operations.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/Signup"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PeopleForce. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
