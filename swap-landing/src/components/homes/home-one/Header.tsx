import { Link } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { swapAppRoutes } from "../../../config/appRoutes";

const Header = () => {
  const [open, setOpen] = useState(false);
  const isClient = typeof window !== "undefined";
  const currentOrigin = isClient ? window.location.origin : "";
  const signInIsLocal = isClient && swapAppRoutes.signin.startsWith(currentOrigin);
  const registerIsLocal = isClient && swapAppRoutes.register.startsWith(currentOrigin);

  const renderAuthCTA = (
    type: "signin" | "register",
    className: string,
    content: ReactNode,
    onClick?: () => void,
    ariaLabel?: string
  ) => {
    const isLocal = type === "signin" ? signInIsLocal : registerIsLocal;
    const defaultAria = ariaLabel ?? (type === "signin" ? "Sign in to Swap" : "Join Swap for free");

    if (isLocal) {
      const to = type === "signin" ? "/signin" : "/register";
      return (
        <Link to={to} className={className} aria-label={defaultAria} onClick={onClick}>
          {content}
        </Link>
      );
    }

    const href = type === "signin" ? swapAppRoutes.signin : swapAppRoutes.register;
    return (
      <a href={href} className={className} aria-label={defaultAria} onClick={onClick}>
        {content}
      </a>
    );
  };

  return (
    <header>
      {/* simple sticky via CSS only */}
      <div
        id="header-sticky"
        className="td-header__area td-header-spacing p-relative z-index-1"
        style={{ position: "sticky", top: 0, backdropFilter: "blur(6px)", background: "rgba(255,255,255,.9)" }}
      >
        <div className="container container-1750">
          <div className="row align-items-center">
            {/* left: mobile burger */}
            <div className="col-lg-4 col-md-4 col-sm-4 col-5">
              <div className="tdmenu__wrap">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="tdmenu-offcanvas-open-btn mobile-nav-toggler d-flex align-items-center justify-content-center"
                  aria-label="Toggle menu"
                  aria-expanded={open}
                >
                  <span className="text mr-5">menu</span>
                  <div className="tdmenu-offcanvas-open-bar">
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>
            </div>

            {/* center: logo */}
            <div className="col-lg-4 col-md-4 col-sm-4 col-5">
              <div className="logo text-center">
                <Link className="logo-1" to="/">
                  <img data-width="96" src="/assets/img/lg-2.png" alt="Swap — Knowledge Exchange" />
                </Link>
              </div>
            </div>

            {/* right: CTA */}
            <div className="col-lg-4 col-md-4 col-sm-4 col-2">
              <div className="td-header-right text-end">
                {renderAuthCTA(
                  "signin",
                  "td-btn td-btn-lg d-none d-md-inline-block td-btn-outline mr-10 td-btn-switch-animation",
                  (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="btn-text"> Sign In </span>
                      <span className="btn-icon"><i className="fa-sharp fa-solid fa-arrow-right-to-bracket"></i></span>
                    </span>
                  )
                )}
                {renderAuthCTA(
                  "register",
                  "td-btn td-btn-lg d-none d-md-inline-block td-btn-switch-animation ml-10",
                  (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="btn-text"> Join Free </span>
                      <span className="btn-icon"><i className="fa-sharp fa-solid fa-angle-right"></i></span>
                      <span className="btn-icon"><i className="fa-sharp fa-solid fa-angle-right"></i></span>
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* desktop nav 
          <nav className="d-none d-md-flex justify-content-center mt-15">
            <ul className="d-flex align-items-center" style={{ gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
              <li><Link to="/about">About</Link></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/signin">Sign In</Link></li>
            </ul>
          </nav>
            */}
          {/* dropdown menu */}
          {open && (
            <nav
              className="mt-10 td-rounded-10"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: "16px",
                zIndex: 1000,
                border: "1px solid rgba(28,29,31,.08)",
                background: "white",
                boxShadow: "0 8px 24px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.04)",
                minWidth: "260px",
                borderRadius: "12px",
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: "8px" }}>
                <li>
                  <Link 
                    to="/about" 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    About Swap
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/smart-matching" 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    Smart Matching
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/flexible-scheduling" 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    Flexible Scheduling
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-exchange" 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    Knowledge Exchange
                  </Link>
                </li>
                <li>
                  <a 
                    href="/#how-it-works" 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href={swapAppRoutes.community} 
                    onClick={() => setOpen(false)}
                    style={{ 
                      display: "block",
                      color: "#1c1d1f", 
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: 500,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(190, 255, 1, 0.1)";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1c1d1f";
                    }}
                  >
                    Community
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;