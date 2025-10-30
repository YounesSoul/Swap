"use client";

import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import EnhancedLandingNav from '@/components/EnhancedLandingNav';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSupabaseAuth();

  const toCreateAccount = () =>
    router.push(`/register?callbackUrl=${encodeURIComponent("/onboarding")}`);

  const toLogin = () =>
    router.push(
      `/signin?mode=email&callbackUrl=${encodeURIComponent(
        "/dashboard",
      )}#email-login`,
    );

  const toDashboard = () => router.push("/dashboard");



  return (
    <>
      {/* Modern Landing Navigation */}
      <EnhancedLandingNav />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      
      {/* Enhanced decorative shapes */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-15%] top-32 h-96 w-96 rounded-full bg-gradient-to-l from-violet-500/20 to-purple-600/20 blur-3xl animate-pulse delay-1000" />
      <div className="pointer-events-none absolute left-1/2 bottom-[-20%] h-72 w-72 rounded-full bg-gradient-to-t from-emerald-400/20 to-teal-500/20 blur-2xl animate-pulse delay-2000" />

      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
                <span className="text-cyan-300 text-sm font-medium">✨ Next Generation Learning Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Exchange Your
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Skills &
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Knowledge
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                Connect with fellow students to share what you know and learn what you need. 
                No money involved — just pure knowledge exchange in a collaborative community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {user ? (
                <button
                  onClick={toDashboard}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1"
                >
                  Go to Dashboard
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </button>
              ) : (
                <>
                  <button
                    onClick={toCreateAccount}
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1"
                  >
                    Get Started Free
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                  </button>
                  <button
                    onClick={toLogin}
                    className="px-8 py-4 border border-slate-600 bg-slate-800/50 backdrop-blur-sm text-slate-200 font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-500"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Enhanced feature bullets */}
            <div className="grid grid-cols-1 gap-4 mt-12">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Find Skill Partners</h4>
                  <p className="text-slate-400 text-sm">Connect with students who have the knowledge you need</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Exchange Knowledge</h4>
                  <p className="text-slate-400 text-sm">Trade your expertise for skills you want to learn</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Build Community</h4>
                  <p className="text-slate-400 text-sm">Create lasting connections with fellow learners and knowledge sharers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Enhanced Illustration Card */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:pl-8">
            <div className="relative w-full max-w-lg lg:mt-16">
              {/* Main Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl border border-slate-600/50 w-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Knowledge Exchange</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Share what you know, learn what you need. Connect with peers 
                      for collaborative learning without any money involved.
                    </p>
                  </div>
                  <div className="ml-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6 justify-items-center">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 w-full">
                    <div className="text-2xl font-bold text-cyan-400">2.5k+</div>
                    <div className="text-xs text-slate-400">Learners</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 w-full">
                    <div className="text-2xl font-bold text-violet-400">150+</div>
                    <div className="text-xs text-slate-400">Skills</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 w-full">
                    <div className="text-2xl font-bold text-emerald-400">100%</div>
                    <div className="text-xs text-slate-400">Free</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 text-center">
                    Find Skills
                  </button>
                  <button className="flex-1 py-3 px-4 border border-slate-600 bg-slate-800/50 text-slate-200 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-slate-700/50 text-center">
                    How It Works
                  </button>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 animate-bounce delay-1000"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse"></div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 blur-xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Sections */}
        <div className="mt-24 space-y-16">
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Matching</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our AI-powered system connects you with the perfect study partners based on your goals and learning style.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Flexible Scheduling</h3>
                <p className="text-slate-400 leading-relaxed">
                  Book sessions that work with your schedule. Study when you're most productive and motivated.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Skill Exchange</h3>
                <p className="text-slate-400 leading-relaxed">
                  Trade your expertise for knowledge you need. Create fair exchanges that benefit both learners.
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Features */}
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700/50">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium mb-4">
                  🎯 For Learners
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Excel</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  Access a comprehensive dashboard that surfaces the right opportunities, 
                  matches, and sessions to accelerate your learning journey.
                </p>
                <button 
                  onClick={toDashboard}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Explore Dashboard
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-sm border border-slate-700/50">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
                  🤝 For Sharers
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Share Your Knowledge</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  Help fellow students succeed while learning from them in return. 
                  Build meaningful connections through collaborative knowledge exchange.
                </p>
                <button 
                  onClick={toCreateAccount}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Start Sharing
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="mt-24 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>
            
            {/* Main CTA Card */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 p-12 text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/30 to-violet-500/30 border border-cyan-500/50">
                  <span className="text-cyan-200 text-sm font-medium">🚀 Join 2,500+ Students Already Learning</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Ready to Join the
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    Knowledge Exchange?
                  </span>
                </h2>
                
                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Connect with fellow students, share your skills, learn from others, 
                  and build lasting academic relationships — all completely free.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={toCreateAccount}
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1"
                  >
                    Join the Community
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                  </button>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100% Free • No money required • Pure skill exchange
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 left-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 right-1/4 w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-60 animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Start your knowledge exchange journey in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Share your skills and what you want to learn",
                icon: "👤"
              },
              {
                step: 2, 
                title: "Get Matched",
                description: "Our AI finds perfect learning partners for you",
                icon: "🤝"
              },
              {
                step: 3,
                title: "Start Learning",
                description: "Schedule sessions and exchange knowledge",
                icon: "📚"
              },
              {
                step: 4,
                title: "Grow Together", 
                description: "Build skills and lasting relationships",
                icon: "🚀"
              }
            ].map((step, index) => (
              <div key={step.step} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={toCreateAccount}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1"
            >
              Start Your Journey
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Knowledge exchange shouldn't cost a fortune. That's why Swap is completely free.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/30 text-center">
              <div className="mb-8">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                  $0
                </div>
                <div className="text-2xl text-slate-300 mt-2">Forever Free</div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
                  <ul className="space-y-3 text-slate-300">
                    {[
                      "Unlimited knowledge exchanges",
                      "AI-powered smart matching", 
                      "Community access",
                      "Session scheduling",
                      "Progress tracking",
                      "Mobile app access"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Philosophy</h3>
                  <div className="text-slate-300 space-y-4 text-left">
                    <p>💡 Knowledge should be freely shared</p>
                    <p>🤝 Everyone has something to teach</p>
                    <p>🌱 Learning is a mutual exchange</p>
                    <p>🚫 No money, no barriers</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-600/30 pt-8">
                <button
                  onClick={toCreateAccount}
                  className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl text-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1"
                >
                  Start Learning for Free
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </button>
                <p className="text-slate-400 text-sm mt-4">
                  No credit card required • No hidden fees • Cancel anytime (but why would you?)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  );
}