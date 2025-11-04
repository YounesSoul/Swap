import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Brain, Clock, Sparkles, Star, Target, Users, Zap } from 'lucide-react';
import Header from '@/components/homes/home-one/Header';
import Footer from '@/components/homes/home-one/Footer';
import '@/styles/features.scss';

const SmartMatching: React.FC = () => {
  const heroHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Intelligent algorithms surface the partners who fit your goals and strengths.',
    },
    {
      icon: Target,
      title: 'Precision Pairing',
      description: 'Compatibility scores factor in skills, interests, and preferred collaboration styles.',
    },
    {
      icon: Users,
      title: 'Curated Intros',
      description: 'Review detailed profiles and connect with confidence when the fit feels right.',
    },
  ];

  const matchingFactors: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Target,
      title: 'Skill Compatibility',
      description: 'We align your learning goals with peers who excel in those exact subjects and levels.',
    },
    {
      icon: Clock,
      title: 'Schedule Alignment',
      description: 'Time zones and weekly availability are balanced automatically to make sessions effortless.',
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      description: 'See community feedback and track record before you accept the match.',
    },
    {
      icon: Users,
      title: 'Learning Style',
      description: 'Preferred teaching methods and collaboration rhythms shape every suggestion.',
    },
    {
      icon: Sparkles,
      title: 'Academic Background',
      description: 'Filter by programs, majors, and courses so conversations stay context-rich.',
    },
    {
      icon: Zap,
      title: 'Speed to Match',
      description: 'Get matched in minutes when you need help fast—no endless searching required.',
    },
  ];

  const processSteps = [
    {
      title: 'Complete Your Profile',
      description:
        'Highlight your strengths, goals, and study preferences so the right partners can find you instantly.',
    },
    {
      title: 'Smart Algorithm Works',
      description:
        'Our engine analyzes thousands of data points to recommend peers who complement your journey.',
    },
    {
      title: 'Review Curated Matches',
      description:
        'Browse detailed profiles, compatibility markers, and availability before you commit.',
    },
    {
      title: 'Connect & Learn',
      description:
        'Send a request, schedule your first session, and start exchanging knowledge with confidence.',
    },
  ];

  return (
    <div className="td-feature-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="td-section-spacing td-about-hero td-feature-hero td-feature-hero--matching p-relative z-index-1">
          <div className="td-about-hero-shape td-about-hero-shape-1" aria-hidden="true" />
          <div className="td-about-hero-shape td-about-hero-shape-2" aria-hidden="true" />

          <div className="container">
            <div className="row align-items-center justify-content-between g-5">
              <div className="col-lg-6">
                <div className="td-about-hero-copy">
                  <span className="td-about-hero-badge">Smart Matching</span>
                  <h1 className="td-about-hero-title">Find your perfect study partner</h1>
                  <p className="td-about-hero-text">
                    Our intelligent matching engine connects you with peers who complement your goals, rhythms, and availability—so
                    every session starts on the right foot.
                  </p>
                  <div className="td-about-hero-cta">
                    <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                      Find your match
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

        {/* Matching Factors */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60  td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Matching intelligence</span>
                <h2 className="td-about-heading">What we consider before introducing you</h2>
                <p className="td-about-subtitle">
                  The engine blends qualitative and quantitative signals, so you never waste time with off-target matches.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {matchingFactors.map(({ icon: Icon, title, description }) => (
                <div key={title} className="col-lg-4 col-md-6">
                  <div className="td-feature-card td-rounded-20">
                    <div className="td-feature-card__icon">
                      <Icon size={20} />
                    </div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="td-about-journey td-section-spacing p-relative">
          <div className="td-about-journey-shape" aria-hidden="true" />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="td-about-journey-intro">
                  <span className="td-about-label">The flow</span>
                  <h2 className="td-about-heading">Matching that feels natural, not random</h2>
                  <p>
                    From profile creation to the first session, Smart Matching ensures every step feels guided, intentional, and in
                    sync with your priorities.
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="td-about-steps td-rounded-20">
                  {processSteps.map(({ title, description }, index) => (
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

        {/* Stats Section */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60  td-feature-section-intro">
              <div className="col-xl-6 col-lg-7">
                <span className="td-about-label">Impact</span>
                <h2 className="td-about-heading">Smart Matching keeps the momentum high</h2>
              </div>
            </div>

            <div className="td-feature-stats">
              <div className="td-feature-stat">
                <h3>95%</h3>
                <p>Match satisfaction</p>
              </div>
              <div className="td-feature-stat">
                <h3>&lt;2 min</h3>
                <p>Average match time</p>
              </div>
              <div className="td-feature-stat">
                <h3>10k+</h3>
                <p>Successful connections</p>
              </div>
              <div className="td-feature-stat">
                <h3>4.8/5</h3>
                <p>Partner rating</p>
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
                <span className="td-about-label">Take the next step</span>
                <h2 className="td-about-heading">Let Swap introduce you to your next study partner</h2>
                <p>
                  Activate Smart Matching, connect with aligned peers, and keep your academic momentum strong with a partner who truly
                  fits.
                </p>
                <div className="td-about-hero-cta">
                  <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                    Get matched now
                  </Link>
                  <Link className="td-btn td-btn-lg td-btn-outline" to="/features/knowledge-exchange">
                    Explore knowledge exchange
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

export default SmartMatching;
