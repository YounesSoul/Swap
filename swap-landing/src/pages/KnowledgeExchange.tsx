import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Award, BookOpen, CheckCircle, TrendingUp, Users } from 'lucide-react';
import Header from '@/components/homes/home-one/Header';
import Footer from '@/components/homes/home-one/Footer';
import '@/styles/features.scss';

const KnowledgeExchange: React.FC = () => {
  const heroHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: BookOpen,
      title: 'Diverse Topics',
      description: 'Exchange knowledge across countless subjects and disciplines.',
    },
    {
      icon: Users,
      title: 'Peer-to-Peer',
      description: 'Connect with students who understand your needs and goals.',
    },
    {
      icon: Award,
      title: 'Earn Recognition',
      description: 'Build credibility with every session and verified review.',
    },
  ];

  const journeySteps = [
    {
      title: 'Share Your Skills',
      description:
        "List the subjects you're confident teaching—from calculus to creative writing—to reach the learners who need you.",
    },
    {
      title: 'Find Learning Partners',
      description:
        'Browse peers who complement your goals and let smart suggestions surface the best exchange opportunities.',
    },
    {
      title: 'Exchange Sessions',
      description:
        'Teach to earn tokens, schedule what you want to learn, and keep momentum with shared notes and transcripts.',
    },
    {
      title: 'Grow Together',
      description:
        'Build lasting study relationships, improve by teaching, and celebrate collective progress.',
    },
  ];

  const benefits: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Users,
      title: 'Peer-to-Peer Learning',
      description:
        'Learn from students who recently mastered the material and understand the challenges you face.',
    },
    {
      icon: Award,
      title: 'Deepen Understanding',
      description: 'Teaching others is the fastest route to mastery. Solidify what you know by sharing it.',
    },
    {
      icon: TrendingUp,
      title: 'Build Your Reputation',
      description: 'Earn ratings, testimonials, and a standout academic profile with every exchange.',
    },
    {
      icon: CheckCircle,
      title: 'Fair & Balanced',
      description: 'Time-based tokens guarantee equitable exchanges so everyone both gives and gains.',
    },
  ];

  return (
    <div className="td-feature-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="td-section-spacing td-about-hero td-feature-hero td-feature-hero--exchange p-relative z-index-1">
          <div className="td-about-hero-shape td-about-hero-shape-1" aria-hidden="true" />
          <div className="td-about-hero-shape td-about-hero-shape-2" aria-hidden="true" />

          <div className="container">
            <div className="row align-items-center justify-content-between g-5">
              <div className="col-lg-6">
                <div className="td-about-hero-copy">
                  <span className="td-about-hero-badge">Knowledge Exchange</span>
                  <h1 className="td-about-hero-title">Learn, share, and grow together</h1>
                  <p className="td-about-hero-text">
                    Connect with peers who have the knowledge you need while sharing your own expertise. Co-create a collaborative
                    learning environment where everyone benefits.
                  </p>
                  <div className="td-about-hero-cta">
                    <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                      Start exchanging
                    </Link>
                    <Link className="td-btn td-btn-lg td-btn-outline" to="/about">
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="td-feature-hero-panel td-rounded-20">
                  {heroHighlights.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="td-feature-hero-card">
                      <div className="td-feature-icon">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="td-about-journey td-section-spacing p-relative">
          <div className="td-about-journey-shape" aria-hidden="true" />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="td-about-journey-intro">
                  <span className="td-about-label">How it works</span>
                  <h2 className="td-about-heading">Knowledge exchange built for momentum</h2>
                  <p>
                    Move from curiosity to collaboration in a few guided steps. Showcase what you can teach, discover who can help,
                    and keep the progress flowing.
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="td-about-steps td-rounded-20">
                  {journeySteps.map(({ title, description }, index) => (
                    <div key={title} className="td-about-step">
                      <div className="td-about-step-index">{String(index + 1).padStart(2, '0')}</div>
                      <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="td-about-values td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-6  td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Why it matters</span>
                <h2 className="td-about-heading">A fair system built around shared progress</h2>
                <p className="td-about-subtitle">
                  Every exchange gives you fresh perspective, keeps accountability high, and ensures students uplift one another.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="col-lg-3 col-md-6">
                  <div className="td-about-value td-rounded-20">
                    <div className="td-about-value-icon">
                      <Icon size={22} />
                    </div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60  td-feature-section-intro">
              <div className="col-xl-6 col-lg-7">
                <span className="td-about-label">Proof in numbers</span>
                <h2 className="td-about-heading">Real traction from real exchanges</h2>
              </div>
            </div>

            <div className="td-feature-stats">
              <div className="td-feature-stat">
                <h3>5k+</h3>
                <p>Sessions completed</p>
              </div>
              <div className="td-feature-stat">
                <h3>150+</h3>
                <p>Subjects covered</p>
              </div>
              <div className="td-feature-stat">
                <h3>98%</h3>
                <p>Positive ratings</p>
              </div>
              <div className="td-feature-stat">
                <h3>24/7</h3>
                <p>Global availability</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="td-about-cta td-section-spacing">
          <div className="container">
            <div className="td-about-cta-wrap td-rounded-20 p-relative overflow-hidden">
              <img className="td-about-cta-shape" src="/assets/img/cta/cta.png" alt="" aria-hidden="true" />
              <div className="td-about-cta-content">
                <span className="td-about-label">Ready to start?</span>
                <h2 className="td-about-heading">Join thousands of students exchanging knowledge every day</h2>
                <p>
                  Create a free account, add the skills you can teach, and book the sessions that move you forward. Swap keeps the
                  energy high and the learning equitable.
                </p>
                <div className="td-about-hero-cta">
                  <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                    Get started for free
                  </Link>
                  <Link className="td-btn td-btn-lg td-btn-outline" to="/features/community-hub">
                    Explore community stories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default KnowledgeExchange;
