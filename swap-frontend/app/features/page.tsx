import Link from 'next/link';
import { ArrowRight, Users, Zap, Heart, Calendar } from 'lucide-react';

const features = [
  {
    title: "Knowledge Exchange",
    href: "/features/exchange",
    description: "Share what you know, learn what you need through peer-to-peer knowledge trading",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    highlights: [
      "Teach your skills to others",
      "Learn new skills from peers", 
      "No money involved - pure knowledge exchange",
      "Build teaching and learning experience"
    ]
  },
  {
    title: "Smart Matching",
    href: "/features/matching",
    description: "AI-powered algorithms match you with perfect learning partners based on skills and goals",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    highlights: [
      "Intelligent skill-based matching",
      "Find complementary learning partners",
      "Mutual benefit connections",
      "Compatibility scoring system"
    ]
  },
  {
    title: "Community Hub",
    href: "/features/community-hub",
    description: "Connect with like-minded learners in a supportive, collaborative environment",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    highlights: [
      "Join skill-based communities",
      "Participate in group discussions",
      "Share learning achievements",
      "Get support from peers"
    ]
  },
  {
    title: "Session Management",
    href: "/features/sessions",
    description: "Seamlessly schedule, manage and track your learning sessions",
    icon: Calendar,
    color: "from-orange-500 to-red-500",
    highlights: [
      "Easy session scheduling",
      "Built-in video calls",
      "Progress tracking",
      "Session history and notes"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Platform Features</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover how Swap makes knowledge exchange seamless, effective, and enjoyable 
            for learners and teachers alike.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-slate-600/30"
              >
                {/* Icon Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{feature.title}</h2>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3 mb-8">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                      <span className="text-slate-300">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link 
                  href={feature.href}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 group-hover:translate-x-1"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-white border border-slate-600/30">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners already exchanging knowledge and growing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="#how-it-works"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-800 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}