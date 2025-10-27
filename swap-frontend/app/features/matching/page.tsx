import Link from 'next/link';
import { ArrowRight, Brain, Target, Zap, Users, CheckCircle, Star } from 'lucide-react';

const matchingFeatures = [
  {
    title: "Skill Compatibility",
    description: "Our AI analyzes your skills and learning goals to find perfect matches",
    icon: Brain
  },
  {
    title: "Learning Style Matching",
    description: "Connect with people who complement your learning and teaching style", 
    icon: Target
  },
  {
    title: "Mutual Benefit Scoring",
    description: "Ensure both parties gain maximum value from the knowledge exchange",
    icon: Zap
  }
];

const matchingProcess = [
  "Complete your skill profile and learning preferences",
  "Our AI analyzes compatibility across multiple dimensions", 
  "Get personalized match recommendations with compatibility scores",
  "Connect with your best matches and start learning"
];

const testimonials = [
  {
    name: "Sarah Chen", 
    skills: "Python ↔ UI/UX Design",
    quote: "The matching system found me the perfect learning partner. We complement each other's skills perfectly!",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    skills: "Marketing ↔ Web Development", 
    quote: "I was amazed at how well the AI understood what I needed. My match and I have been learning together for 3 months now.",
    rating: 5
  }
];

export default function SmartMatchingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Smart Matching</h1>
            <p className="text-xl opacity-90 mb-8">
              Powered by AI, our intelligent matching system connects you with the perfect learning 
              partners based on skills, goals, and compatibility.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Your Match
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Matching Features */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Intelligent Matching Technology</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our advanced algorithms consider multiple factors to ensure you find the best learning partners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {matchingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-600/30">
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

      {/* How Matching Works */}
      <div className="bg-slate-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">How Smart Matching Works</h2>
              <p className="text-xl text-slate-300">
                From profile creation to perfect matches in four simple steps
              </p>
            </div>

            <div className="space-y-6">
              {matchingProcess.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-slate-300 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Success Stories</h2>
          <p className="text-xl text-slate-300">
            See how our matching system has helped learners find perfect partners
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-600/30">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
              <div className="border-t border-slate-600/30 pt-4">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-cyan-400 font-medium">{testimonial.skills}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-white text-center border border-slate-600/30">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community and let our AI find the ideal learning partners for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Matched Now
            </Link>
            <Link 
              href="/features"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-800 transition-colors"
            >
              Explore More Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}