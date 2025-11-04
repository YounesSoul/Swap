import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Globe, Heart, MessageCircle, Shield, Share2, Sparkle, Users2 } from 'lucide-react';
import Header from '@/components/homes/home-one/Header';
import Footer from '@/components/homes/home-one/Footer';
import '@/styles/features.scss';

const CommunityHub: React.FC = () => {
  const heroHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: MessageCircle,
      title: 'Real-Time Chat',
      description: 'Connect instantly with peers, mentors, and study groups that energize you.',
    },
    {
      icon: Users2,
      title: 'Study Circles',
      description: 'Form communities around shared goals, exams, and academic journeys.',
    },
    {
      icon: Share2,
      title: 'Resource Library',
      description: 'Trade notes, decks, and templates so everyone learns faster together.',
    },
  ];

  const communityFeatures: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: MessageCircle,
      title: 'Direct Messaging',
      description: 'Coordinate sessions, ask quick questions, and stay accountable with one-to-one chat.',
    },
    {
      icon: Users2,
      title: 'Collaborative Groups',
      description: 'Build themed spaces for courses, interests, and campus communities.',
    },
    {
      icon: Share2,
      title: 'Resource Sharing',
      description: 'Swap decks, study guides, and recordings to keep everyone on the same page.',
    },
    {
      icon: Heart,
      title: 'Peer Support',
      description: 'Celebrate wins, stay motivated, and lean on students who get what you’re facing.',
    },
    {
      icon: Sparkle,
      title: 'Spotlight Stories',
      description: 'Showcase achievements and inspire others with success journeys from the community.',
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with learners from universities worldwide and spark new perspectives.',
    },
  ];

  const communityValues: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Shield,
      title: 'Safe & Respectful',
      description: 'Moderation and verification create a space where every member feels welcome.',
    },
    {
      icon: Users2,
      title: 'Collaborative Spirit',
      description: 'We move faster when we move together—support flows both ways in every exchange.',
    },
    {
      icon: Sparkle,
      title: 'Growth Mindset',
      description: 'Curiosity is celebrated, questions are encouraged, and effort is always respected.',
    },
    {
      icon: Heart,
      title: 'Give & Receive',
      description: 'Share your expertise, learn from others, and build momentum through reciprocity.',
    },
  ];

  const testimonials = [
    {
      quote:
        '“The community keeps me accountable and motivated. I learn as much from the conversations as I do from the sessions.”',
      name: 'Sarah M.',
      role: 'Computer Science, MIT',
    },
    {
      quote:
        '“Everyone is so generous with their time and resources. It feels like a campus commons that never closes.”',
      name: 'James K.',
      role: 'Engineering, Stanford',
    },
    {
      quote:
        '“Study groups here helped me prep for finals without the panic. The encouragement is real.”',
      name: 'Priya R.',
      role: 'Medicine, Harvard',
    },
  ];

  return (
    <div className="td-feature-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="td-section-spacing td-about-hero td-feature-hero td-feature-hero--community p-relative z-index-1">
          <div className="td-about-hero-shape td-about-hero-shape-1" aria-hidden="true" />
          <div className="td-about-hero-shape td-about-hero-shape-2" aria-hidden="true" />

          <div className="container">
            <div className="row align-items-center justify-content-between g-5">
              <div className="col-lg-6">
                <div className="td-about-hero-copy">
                  <span className="td-about-hero-badge">Community Hub</span>
                  <h1 className="td-about-hero-title">Connect, collaborate, and succeed together</h1>
                  <p className="td-about-hero-text">
                    Join a vibrant community of learners and teachers. Share experiences, find support, and build lasting academic
                    relationships that keep motivation high.
                  </p>
                  <div className="td-about-hero-cta">
                    <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                      Join the community
                    </Link>
                    <Link className="td-btn td-btn-lg td-btn-outline" to="/signin">
                      Sign in
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

        {/* Community Features */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Community toolkit</span>
                <h2 className="td-about-heading">Everything you need to collaborate with peers</h2>
                <p className="td-about-subtitle">
                  Tools, spaces, and rituals designed to make collective learning joyful and sustainable.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {communityFeatures.map(({ icon: Icon, title, description }) => (
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

        {/* Community Values */}
        <section className="td-about-values td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Our ethos</span>
                <h2 className="td-about-heading">Principles that keep the hub thriving</h2>
                <p className="td-about-subtitle">
                  Community guidelines shape every interaction so students feel seen, supported, and inspired to give back.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {communityValues.map(({ icon: Icon, title, description }) => (
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

        {/* Community Stats */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-6 col-lg-7">
                <span className="td-about-label">By the numbers</span>
                <h2 className="td-about-heading">A thriving network of students worldwide</h2>
              </div>
            </div>

            <div className="td-feature-stats">
              <div className="td-feature-stat">
                <h3>50k+</h3>
                <p>Active members</p>
              </div>
              <div className="td-feature-stat">
                <h3>500+</h3>
                <p>Study groups</p>
              </div>
              <div className="td-feature-stat">
                <h3>200+</h3>
                <p>Universities</p>
              </div>
              <div className="td-feature-stat">
                <h3>100k+</h3>
                <p>Daily messages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="td-section-spacing td-feature-testimonials-section">
          <div className="container">
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Community voices</span>
                <h2 className="td-about-heading">What students are saying</h2>
              </div>
            </div>

            <div className="td-feature-testimonials">
              {testimonials.map(({ quote, name, role }) => (
                <div key={name} className="td-feature-testimonial">
                  <p className="td-feature-testimonial__quote">{quote}</p>
                  <div className="td-feature-testimonial__author">
                    <strong>{name}</strong>
                    <span>{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="td-about-cta td-section-spacing  td-feature-section-intro">
          <div className="container">
            <div className="td-about-cta-wrap td-rounded-20 p-relative overflow-hidden">
              <img className="td-about-cta-shape" src="/assets/img/cta/cta.png" alt="" aria-hidden="true" />
              <div className="td-about-cta-content">
                <span className="td-about-label">Join us</span>
                <h2 className="td-about-heading">Step into the most supportive study hub online</h2>
                <p>
                  Whether you’re mentoring, learning, or doing both, the Community Hub keeps you surrounded by students championing the
                  same mission.
                </p>
                <div className="td-about-hero-cta">
                  <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                    Become a member
                  </Link>
                  <Link className="td-btn td-btn-lg td-btn-outline" to="/features/smart-matching">
                    See smart matching
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

export default CommunityHub;
