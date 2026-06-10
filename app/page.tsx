import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { 
  CheckCircle2, 
  Dumbbell, 
  Heart, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Flame, 
  Zap,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import InteractivePreview from './components/landing/interactive-preview';

export const metadata = {
  title: 'Momentum | Your Personal Operating System for Habits & Health',
  description: 'Track habits, log workouts, and monitor sleep and mood in one cohesive, beautiful workspace. Built for high-achievers who want deep metrics and gamified streaks.',
};

export default async function LandingPage() {
  const { userId } = await auth();

  // Redirect to today if logged in
  if (userId) {
    redirect('/today');
  }

  return (
    <div className="flex-1 flex flex-col bg-[#030303] text-[#f4f4f5] relative overflow-hidden font-sans">
      {/* SEO WebApplication JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Momentum",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "All",
            "browserRequirements": "Requires HTML5",
            "description": "Your personal operating system for habits, fitness, and wellness tracking.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Animated / Gradient Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#10b981]/5 rounded-full blur-[140px] pointer-events-none animate-soft-pulse" />
      <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.svg" 
            alt="Momentum Logo" 
            className="w-9 h-9 rounded-xl bg-[#10b981]/5 border border-[#10b981]/20 p-1 object-contain" 
          />
          <span className="text-sm font-black tracking-widest text-white">
            MOMENTUM
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-xs font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="text-xs font-bold bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/20 border border-[#10b981]/30 px-4 py-2.5 rounded-xl transition-all cursor-pointer active-bounce">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Heading and Value Prop */}
        <div className="lg:col-span-7 space-y-8 text-left max-w-2xl">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Interactive Life OS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] font-sans">
              Gamify Your Habits.<br />
              <span className="bg-gradient-to-r from-[#10b981] to-emerald-400 bg-clip-text text-transparent">
                Accelerate Momentum.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-xl">
              Track habits, schedule workouts, log wellness metrics, and build consistent daily streaks. Momentum is a premium dashboard engineered to treat your life goals like a character progression system.
            </p>
          </div>

          {/* Bullet Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981] mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">Habit Progression Engine</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Completing tasks gains XP and increments your dynamic Life Score.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">
                <Dumbbell className="w-3 h-3" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">Workout Tracker Capsule</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Log custom routines, track volume progression, and use visual rest timers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-0.5">
                <Heart className="w-3 h-3" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">Wellness correlation logs</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Overlay sleep, energy levels, and mood to analyze physical output.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mt-0.5">
                <TrendingUp className="w-3 h-3" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">Visual Progress Analytics</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Track consistency heatmaps and charts built on clean vector graphs.</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <SignUpButton mode="modal">
              <button className="h-12 px-6 bg-[#10b981] hover:bg-emerald-500 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-[#10b981]/15 active-bounce">
                Create Free Account
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <button className="h-12 px-6 bg-transparent hover:bg-zinc-900 border border-zinc-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:border-zinc-700 active-bounce">
                Sign In to Platform
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Simulation */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-[36px] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#10b981]/10 to-transparent rounded-[36px] blur-xl opacity-50 pointer-events-none" />
            <InteractivePreview />
          </div>
        </div>

      </section>

      {/* Feature Showcase Grid Section */}
      <section className="border-t border-[#1a1a1c] bg-[#09090b]/40 py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Designed for Consistency. Built for Results.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Stop using fragmented applications. Consolidate your habit dashboard, training logs, and wellness tracking in one secure operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Glass Card 1 */}
            <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] p-8 rounded-2xl space-y-4 text-left hover:border-zinc-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Flexible Habit Schedules</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Log items daily, weekly, or on specific days of the week. Assign custom difficulty values to score habits based on efforts.
              </p>
            </div>

            {/* Glass Card 2 */}
            <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] p-8 rounded-2xl space-y-4 text-left hover:border-zinc-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Structured Fitness Routines</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Build routine structures or run quick logs. Tracks sets, reps, weight progression, and volume stats with precision.
              </p>
            </div>

            {/* Glass Card 3 */}
            <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] p-8 rounded-2xl space-y-4 text-left hover:border-zinc-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Wellness & Correlative Reports</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Monitor sleep duration, sleep quality, and daily energy logs to analyze how sleep changes correlate with habit rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1c] bg-[#030303] py-12 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <img 
              src="/logo.svg" 
              alt="Momentum Logo" 
              className="w-6 h-6 opacity-40 grayscale" 
            />
            <span className="text-xs font-bold tracking-wider font-mono">
              © {new Date().getFullYear()} Momentum OS
            </span>
          </div>

          <div className="flex gap-6 text-xs text-zinc-500 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
