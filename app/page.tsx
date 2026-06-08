import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { 
  CheckSquare, Dumbbell, Heart, UserPlus, LogIn
} from 'lucide-react';

export const metadata = {
  title: 'Momentum | Your Life OS',
  description: 'Your personal operating system for habits, fitness, and wellness.',
};

export default async function LandingPage() {
  const { userId } = await auth();

  // If user is logged in, redirect to the dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex flex-col bg-black text-[#f4f4f5] relative overflow-hidden">
      
      {/* Decorative Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-success/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center max-w-4xl mx-auto space-y-8 z-10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-success/10 text-brand-success border border-brand-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping" />
            Phase 1 Live
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            A Personal Operating System <br />
            <span className="bg-gradient-to-r from-brand-success to-emerald-400 bg-clip-text text-transparent">
              For Your Life Goals
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            Track habits, log workouts, and monitor sleep and mood in one cohesive, beautiful workspace. Built for developers and high-achievers who want deep metrics, not just generic streaks.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <SignInButton mode="modal">
            <button className="w-48 py-3.5 px-6 bg-brand-success hover:bg-brand-success-hover text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-brand-success/15 hover:shadow-brand-success/20">
              <LogIn className="w-4.5 h-4.5 stroke-[2.5]" />
              Sign In to Platform
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="w-48 py-3.5 px-6 bg-transparent hover:bg-[#18181b] border border-[#27272a] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:border-[#3f3f46]">
              <UserPlus className="w-4.5 h-4.5" />
              Register Account
            </button>
          </SignUpButton>
        </div>

        {/* Interactive Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
          <div className="bg-[#09090b] border border-[#27272a] hover:border-zinc-800 rounded-2xl p-6 text-left space-y-3.5 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Flexible Habits Engine</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Log recurring goals (daily, weekly, specific weekdays) with difficulty ratings, context tags, and detailed logs.
            </p>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] hover:border-zinc-800 rounded-2xl p-6 text-left space-y-3.5 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Interactive Workout Logger</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Build custom routines or run preset templates. Tracks volume metrics, estimates 1RM, and launches an automatic visual rest timer capsule.
            </p>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] hover:border-zinc-800 rounded-2xl p-6 text-left space-y-3.5 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Wellness & Sleep Tracker</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Monitor sleep hours, sleep quality, daily mood index, and energy levels to uncover correlations with your physical output.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
