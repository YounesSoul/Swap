import Link from 'next/link';
import { Users, MessageSquare, BookOpen, Trophy, ArrowRight, Star, TrendingUp } from 'lucide-react';

const stats = [
  { label: "Active Learners", value: "2.5k+", icon: Users },
  { label: "Skills Shared", value: "150+", icon: BookOpen }, 
  { label: "Sessions Completed", value: "5k+", icon: Trophy },
  { label: "Success Rate", value: "98%", icon: Star }
];

const communityFeatures = [
  {
    title: "Skill-Based Communities",
    description: "Join groups focused on specific skills like coding, design, languages, and more",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Active Discussions", 
    description: "Participate in forums, ask questions, share insights and get help from peers",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-500"  
  },
  {
    title: "Learning Groups",
    description: "Form study groups and collaborative learning circles with like-minded peers", 
    icon: Users,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Progress Sharing",
    description: "Celebrate achievements, share progress updates and motivate each other",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500"
  }
];

const testimonials = [
  {
    name: "Alex Rodriguez",
    role: "Web Developer",
    quote: "The Swap community is incredible. I've learned React from Sarah while teaching her Spanish. It's been amazing!",
    avatar: "👨‍💻"
  },
  {
    name: "Emily Chen", 
    role: "UI/UX Designer",
    quote: "I love how supportive everyone is here. The community discussions have helped me grow both as a learner and teacher.",
    avatar: "👩‍🎨"
  },
  {
    name: "David Kim",
    role: "Data Scientist", 
    quote: "Found my study group here and we've been learning together for months. The collaborative spirit is unmatched.",
    avatar: "👨‍🔬"
  }
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Join Our Learning Community</h1>
            <p className="text-xl opacity-90 mb-8">
              Connect with passionate learners and skilled teachers from around the world. 
              Share knowledge, build relationships, and grow together.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Community
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-600/30">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Features */}
      <div className="bg-slate-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Community Features</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover all the ways you can connect, learn, and grow within our vibrant community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {communityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600/30 hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Testimonials */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">What Our Community Says</h2>
          <p className="text-xl text-slate-300">
            Real stories from learners and teachers in our community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-600/30">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <h3 className="font-bold text-white">{testimonial.name}</h3>
                <p className="text-cyan-400 font-medium">{testimonial.role}</p>
              </div>
              <p className="text-slate-300 italic text-center">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-white text-center border border-slate-600/30">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start connecting with learners and teachers who share your passion for knowledge exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Now - It's Free
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