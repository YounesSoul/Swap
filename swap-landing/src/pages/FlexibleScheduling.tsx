import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Bell, Calendar, CheckCircle, Clock, Globe, RefreshCw, Zap } from 'lucide-react';
import Header from '@/components/homes/home-one/Header';
import Footer from '@/components/homes/home-one/Footer';
import '@/styles/features.scss';

const FlexibleScheduling: React.FC = () => {
  const heroHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Calendar,
      title: 'Smart Calendar',
      description: 'Integrated scheduling with automatic timezone handling for every session.',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Reserve available time slots in seconds—no back-and-forth messages required.',
    },
    {
      icon: RefreshCw,
      title: 'Flexible Rescheduling',
      description: 'Life changes. Move or cancel sessions with automated updates for everyone.',
    },
  ];

  const featureCards: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Calendar,
      title: 'Availability Sharing',
      description: 'Set the windows that work for you and let learners book directly from your calendar.',
    },
    {
      icon: Globe,
      title: 'Timezone Intelligence',
      description: 'Global collaboration without the mental math—times display in every participant’s zone.',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Stay punctual with nudges before every session and daily roundups of what’s ahead.',
    },
    {
      icon: RefreshCw,
      title: 'Easy Rescheduling',
      description: 'Shift plans with a click; both parties get instant updates and confirmation.',
    },
    {
      icon: CheckCircle,
      title: 'Session Confirmation',
      description: 'Double-confirmed sessions lock in details and build accountability.',
    },
    {
      icon: Clock,
      title: 'Recurring Sessions',
      description: 'Set up weekly or bi-weekly meetings to keep progress steady without rebooking.',
    },
  ];

  const journeySteps = [
    {
      title: 'Set Your Availability',
      description: 'Mark when you can teach or learn and adjust anytime to reflect a changing week.',
    },
    {
      title: 'Browse Available Slots',
      description: 'See partner availability in your timezone so finding the overlap is effortless.',
    },
    {
      title: 'Book & Confirm',
      description: 'Lock in a time that works, get automated confirmations, and share prep notes.',
    },
    {
      title: 'Stay Synced',
      description: 'Receive timely reminders, recap emails, and quick options if you need to reschedule.',
    },
  ];

  const schedulingBenefits: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No more endless message threads—find common ground instantly and get back to learning.',
    },
    {
      icon: Globe,
      title: 'Learn Globally',
      description: 'Collaborate across continents while the platform makes sure everyone shows up on time.',
    },
    {
      icon: Zap,
      title: 'Stay Organized',
      description: 'Keep every session, note, and follow-up in one place with calendar integrations.',
    },
    {
      icon: CheckCircle,
      title: 'Reduce No-Shows',
      description: 'Reminders, confirmations, and nudges keep sessions on the calendar—and in action.',
    },
  ];

  const schedulingTips = [
    {
      title: 'Keep Your Calendar Updated',
      description: 'Refresh your availability weekly so every booking request actually fits your schedule.',
    },
    {
      title: 'Add Buffer Time',
      description: 'Leave space between sessions to reset, reflect, and prep for what’s next.',
    },
    {
      title: 'Confirm Early',
      description: 'Accept requests promptly to lock in energy and give both sides time to prepare.',
    },
    {
      title: 'Use Recurring Sessions',
      description: 'Automate weekly meetups with regular partners to build rhythm and accountability.',
    },
  ];

  return (
    <div className="td-feature-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="td-section-spacing td-about-hero td-feature-hero td-feature-hero--scheduling p-relative z-index-1">
          <div className="td-about-hero-shape td-about-hero-shape-1" aria-hidden="true" />
          <div className="td-about-hero-shape td-about-hero-shape-2" aria-hidden="true" />

          <div className="container">
            <div className="row align-items-center justify-content-between g-5  td-feature-section-intro">
              <div className="col-lg-6">
                <div className="td-about-hero-copy  td-feature-section-intro">
                  <span className="td-about-hero-badge">Flexible Scheduling</span>
                  <h1 className="td-about-hero-title">Learn on your own schedule</h1>
                  <p className="td-about-hero-text">
                    Coordinate effortlessly with tools that understand every timezone, availability change, and last-minute switch up.
                  </p>
                  <div className="td-about-hero-cta">
                    <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                      Start scheduling
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

        {/* Scheduling Features */}
        <section className="td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Scheduling toolkit</span>
                <h2 className="td-about-heading">Made for calendars, class loads, and campus life</h2>
                <p className="td-about-subtitle">
                  Powerful features help you coordinate learning sessions without the friction.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {featureCards.map(({ icon: Icon, title, description }) => (
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

        {/* How It Works */}
        <section className="td-about-journey td-section-spacing p-relative">
          <div className="td-about-journey-shape" aria-hidden="true" />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="td-about-journey-intro">
                  <span className="td-about-label">How it works</span>
                  <h2 className="td-about-heading">Scheduling designed around flexibility</h2>
                  <p>
                    The planning flow gives you clarity, the reminders keep you punctual, and the automation makes collaboration a breeze.
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
            <div className="row justify-content-center text-center mb-60 td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Why it matters</span>
                <h2 className="td-about-heading">Keep momentum without burning out</h2>
                <p className="td-about-subtitle">
                  Flexible scheduling balances ambition with wellbeing, so learning slots fit naturally into your week.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {schedulingBenefits.map(({ icon: Icon, title, description }) => (
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
                <span className="td-about-label">Performance</span>
                <h2 className="td-about-heading">Results powered by flexible planning</h2>
              </div>
            </div>

            <div className="td-feature-stats">
              <div className="td-feature-stat">
                <h3>30 sec</h3>
                <p>Average booking time</p>
              </div>
              <div className="td-feature-stat">
                <h3>98%</h3>
                <p>Session attendance</p>
              </div>
              <div className="td-feature-stat">
                <h3>24/7</h3>
                <p>Booking availability</p>
              </div>
              <div className="td-feature-stat">
                <h3>100+</h3>
                <p>Timezones supported</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="td-section-spacing td-feature-tips-section">
          <div className="container">
            <div className="row justify-content-center text-center mb-60  td-feature-section-intro">
              <div className="col-xl-7 col-lg-8">
                <span className="td-about-label">Pro tips</span>
                <h2 className="td-about-heading">Make the most of flexible scheduling</h2>
              </div>
            </div>

            <div className="td-feature-tips">
              {schedulingTips.map(({ title, description }) => (
                <div key={title} className="td-about-value ">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="td-about-cta td-section-spacing">
          <div className="container">
            <div className="td-about-cta-wrap td-rounded-20 p-relative overflow-hidden">
              <img className="td-about-cta-shape" src="/assets/img/cta/cta.png" alt="" aria-hidden="true" />
              <div className="td-about-cta-content">
                <span className="td-about-label">Ready when you are</span>
                <h2 className="td-about-heading">Coordinate smarter and keep learning on track</h2>
                <p>
                  Join Swap to unlock scheduling that adapts to your life—so every session feels intentional and sustainable.
                </p>
                <div className="td-about-hero-cta">
                  <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                    Get started free
                  </Link>
                  <Link className="td-btn td-btn-lg td-btn-outline" to="/features/community-hub">
                    Meet the community
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

export default FlexibleScheduling;
