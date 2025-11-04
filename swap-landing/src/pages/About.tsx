import Header from "../components/homes/home-one/Header";
import Footer from "../components/homes/home-one/Footer";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
      <Header />
      <main>
        <section className="td-about-hero td-section-spacing p-relative z-index-1">
          <div className="td-about-hero-shape td-about-hero-shape-1" aria-hidden="true" />
          <div className="td-about-hero-shape td-about-hero-shape-2" aria-hidden="true" />

          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-6">
                <div className="td-about-hero-copy">
                  <span className="td-about-hero-badge">About Swap</span>
                  <h1 className="td-about-hero-title">A student-powered exchange for skills, knowledge, and momentum</h1>
                  <p className="td-about-hero-text">
                    Swap started as a campus experiment and has grown into a global student community where everyone can teach
                    something, learn something, and support each other along the way.
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
                <div className="td-about-hero-thumb td-rounded-20 p-relative">
                  <img src="/assets/img/about/tutor.jpg" alt="Students collaborating" />
                  <div className="td-about-hero-card td-rounded-20">
                    <strong>2,500+</strong>
                    <span>active learners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="td-about-values td-section-spacing">
          <div className="container">
            <div className="row justify-content-center text-center mb-60">
              <div className="col-xl-6 col-lg-7">
                <span className="td-about-label">Our principles</span>
                <h2 className="td-about-heading">Designing a fair, safe, and energising way to learn together</h2>
                <p className="td-about-subtitle">
                  Every product decision at Swap is guided by student empathy, transparency, and a belief that knowledge grows when
                  it is shared.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="td-about-value td-rounded-20">
                  <div className="td-about-value-icon"><i className="fa-sharp fa-solid fa-comments" /></div>
                  <h3>Community-first</h3>
                  <p>Profiles, ratings, and transcripts keep every exchange respectful, constructive, and accountable.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="td-about-value td-rounded-20">
                  <div className="td-about-value-icon"><i className="fa-sharp fa-solid fa-scale-balanced" /></div>
                  <h3>Fair exchanges</h3>
                  <p>Time-based credits ensure every skill is valued equally, so students focus on mastery, not money.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="td-about-value td-rounded-20">
                  <div className="td-about-value-icon"><i className="fa-sharp fa-solid fa-magic" /></div>
                  <h3>Guided by AI</h3>
                  <p>Matching, scheduling, and feedback loops are powered by helpful automation that stays out of the way.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="td-about-journey td-section-spacing p-relative">
          <div className="td-about-journey-shape" aria-hidden="true" />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="td-about-journey-intro">
                  <span className="td-about-label">How Swap works</span>
                  <h2 className="td-about-heading">From discovery to exchange, every step is built for motion</h2>
                  <p>
                    Swap makes it simple to move from curiosity to collaboration. Students showcase what they can teach, request what
                    they want to learn, and track progress in one place.
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="td-about-steps td-rounded-20">
                  <div className="td-about-step">
                    <div className="td-about-step-index">01</div>
                    <div>
                      <h3>Curate your profile</h3>
                      <p>Highlight your strengths, availability, and goals so the right learners can find you instantly.</p>
                    </div>
                  </div>
                  <div className="td-about-step">
                    <div className="td-about-step-index">02</div>
                    <div>
                      <h3>Match and schedule</h3>
                      <p>Our matching engine surfaces the most relevant partners and suggests times that work for both of you.</p>
                    </div>
                  </div>
                  <div className="td-about-step">
                    <div className="td-about-step-index">03</div>
                    <div>
                      <h3>Exchange and reflect</h3>
                      <p>Use shared notes, transcripts, and ratings to keep improving and paying it forward to the next learner.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="td-about-impact td-section-spacing">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="td-about-impact-card td-rounded-20">
                  <div>
                    <span className="td-about-impact-label">Swap today</span>
                    <strong>5k+</strong>
                    <p>Sessions completed with full transcripts and action items.</p>
                  </div>
                  <div>
                    <span className="td-about-impact-label">Skill coverage</span>
                    <strong>150+</strong>
                    <p>Subjects across engineering, languages, design, and exam prep.</p>
                  </div>
                  <div>
                    <span className="td-about-impact-label">Satisfaction</span>
                    <strong>98%</strong>
                    <p>Learners rating their experience 4.8/5 or higher.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="td-about-impact-copy">
                  <span className="td-about-label">Why students stay</span>
                  <h2 className="td-about-heading">Swap is built to compound progress</h2>
                  <ul className="td-about-list">
                    <li>
                      <i className="fa-sharp fa-solid fa-people-group" />
                      <span>Peer-led accountability keeps goals visible and achievable.</span>
                    </li>
                    <li>
                      <i className="fa-sharp fa-solid fa-lightbulb" />
                      <span>Every exchange surfaces new perspectives and sparks fresh curiosity.</span>
                    </li>
                    <li>
                      <i className="fa-sharp fa-solid fa-shield-heart" />
                      <span>Safety tooling and verification give students confidence to experiment.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="td-about-cta td-section-spacing">
          <div className="container">
            <div className="td-about-cta-wrap td-rounded-20 p-relative overflow-hidden">
              <img className="td-about-cta-shape" src="/assets/img/cta/cta.png" alt="" aria-hidden="true" />
              <div className="td-about-cta-content">
                <span className="td-about-label">Ready to get started?</span>
                <h2 className="td-about-heading">Join the student exchange designed for momentum, not tuition</h2>
                <p>
                  Create a free account, showcase what you can teach, and request the skills you want to master. Swap is open,
                  inclusive, and powered by students who believe learning should be shared.
                </p>
                <div className="td-about-hero-cta">
                  <Link className="td-btn td-btn-lg td-btn-primary" to="/register">
                    Create your free account
                  </Link>
                  <Link className="td-btn td-btn-lg td-btn-outline" to="/community">
                    Explore the community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer style />
    </>
  );
};

export default AboutPage;
