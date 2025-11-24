const heroIllustration = '/assets/img/about/3333.jpg';

const Hero = () => {
  return (
    <section className="swap-hero">
      <div className="swap-hero__halo" aria-hidden="true" />
      <div className="container">
        <div className="swap-hero__grid">
          <div className="swap-hero__copy">
            <span className="swap-hero__eyebrow">Peer learning reinvented</span>
            <h1>Exchange your skills and knowledge without fees.</h1>
            <p>
              Swap matches students in seconds, tracks time with tokens, and gets mentoring requests
              answered faster than emailing a tutor. No agencies, just a fair trade of expertise.
            </p>

            <div className="swap-hero__actions">
              <a className="swap-hero__cta swap-hero__cta--primary" href="/features/knowledge-exchange">
                <span>ABOUT SWAP</span>
                <span className="swap-hero__cta-icon" aria-hidden="true">
                  <i className="fa-solid fa-arrow-up-right" />
                </span>
              </a>
              <a className="swap-hero__cta swap-hero__cta--outline" href="/register">
                <span>JOIN FOR FREE</span>
                <span className="swap-hero__cta-icon" aria-hidden="true">
                  <i className="fa-solid fa-arrow-up-right" />
                </span>
              </a>
            </div>
          </div>

          <div className="swap-hero__visual">
            <div className="swap-hero__glow" aria-hidden="true" />
            <div className="swap-hero__visual-frame">
              <img src={heroIllustration} alt="Students collaborating" />
              <div className="swap-hero__chip swap-hero__chip--primary">
                <strong>4 min avg.</strong>
                <span>from request to match</span>
              </div>
              <div className="swap-hero__chip swap-hero__chip--secondary">
                <strong>+1 token</strong>
                <span>earned per session taught</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero