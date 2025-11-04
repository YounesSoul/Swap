import { Link } from "react-router-dom"
import { swapAppRoutes } from "../../../config/appRoutes"

interface DataType {
  style?: boolean;
}

const Footer = ({ style }: DataType) => {

  return (
    <footer>
      <div className={`td-footer-area ${style ? "td-footer-spacing" : "pt-120"} black-bg`}>
        <div className="container">
          <div className="row">
            {/* Logo */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="td-footer-logo mb-30">
                <Link to="/">
                  <img src="/assets/img/lg-2.png" alt="Swap" />
                </Link>
              </div>
              <p className="mb-30">
                Share what you know. Learn what you need. <br />100% free, student-first.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="td-footer-widget mb-30">
                <h3 className="td-footer-title mb-30">Quick Links</h3>
                <ul className="td-footer-widget-list">
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/#how-it-works">How It Works</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><a href={swapAppRoutes.community}>Community</a></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* Others / Legal */}
            <div className="col-lg-3 col-md-6">
              <div className="td-footer-widget ml-80 mb-30">
                <h3 className="td-footer-title mb-30">Resources</h3>
                <ul className="td-footer-widget-list">
                  <li><Link to="/terms">Terms</Link></li>
                  <li><Link to="/privacy">Privacy</Link></li>
                  <li><Link to="/style-guide">Style Guide</Link></li>
                  <li><Link to="/changelog">Changelog</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact / Newsletter */}
            <div className="col-lg-4 col-md-6">
              <div className="td-footer-widget mr-30 mb-30">
                <h3 className="td-footer-title mb-30">Stay in the Loop</h3>
                <Link className="td-footer-location mb-20 d-inline-block" to="/contact">
                  Marrakech, Morocco<br />Worldwide community
                </Link>
                <div className="td-footer-form p-relative">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="your@email.com" />
                    <button type="submit" aria-label="Subscribe">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11L11 1" stroke="#1C1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 1H11V11" stroke="#1C1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </div>
                <p className="mt-15" style={{ opacity: .8 }}>Get updates about new features & community events.</p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="col-12">
              <div className="td-footer-bottom mt-45">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-md-8">
                    <div className="td-footer-copyright mb-20">
                      <p>© 2025 <Link to="/">Swap</Link>. All rights reserved.</p>
                    </div>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer