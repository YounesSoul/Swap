import Link from 'next/link';
import { ArrowRight, BookOpen, Users2, TrendingUp, CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: "Teach What You Know",
    description: "Share your expertise and help others learn while reinforcing your own knowledge",
    icon: BookOpen
  },
  {
    title: "Learn What You Need", 
    description: "Access knowledge from peers who have the skills you want to develop",
    icon: TrendingUp
  },
  {
    title: "Build Connections",
    description: "Form meaningful relationships with fellow learners and create lasting networks",
    icon: Users2
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Share Your Skills",
    description: "List the knowledge and skills you can teach others"
  },
  {
    step: 2,
    title: "Find Learning Partners", 
    description: "Browse available skills and connect with potential teachers"
  },
  {
    step: 3,
    title: "Exchange Knowledge",
    description: "Schedule sessions and start learning from each other"
  },
  {
    step: 4,
    title: "Grow Together",
    description: "Track progress and build lasting learning relationships"
  }
];

export default function KnowledgeExchangePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Knowledge Exchange</h1>
            <p className="text-xl opacity-90 mb-8">
              The heart of Swap - where learning meets teaching in perfect harmony. 
              Share what you know and learn what you need, all without spending a dime.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Exchanging
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Why Knowledge Exchange Works</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our peer-to-peer learning model creates win-win situations where everyone grows together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center group">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How Knowledge Exchange Works</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Simple steps to start your knowledge exchange journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Preview */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-white text-center border border-slate-600/30">
          <h2 className="text-3xl font-bold mb-6">Join the Knowledge Exchange</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Thousands of learners are already sharing knowledge and growing together. 
            What will you learn today?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning
            </Link>
            <Link 
              href="/features"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-800 transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}