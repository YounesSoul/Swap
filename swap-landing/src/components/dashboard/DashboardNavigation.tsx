import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, Wallet, X } from "lucide-react";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useSwap, type RequestItem, type SessionItem, type SwapState } from "@/lib/store";

const classNames = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(" ");

type NavItem = {
  key: string;
  label: string;
  href: string;
  badge?: number;
  external?: boolean;
};

const DashboardNavigation = () => {
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tokenBalance = useSwap((state: SwapState) => state.tokenBalance);
  const inbox = useSwap((state: SwapState) => state.inbox);
  const sessions = useSwap((state: SwapState) => state.sessions);
  const me = useSwap((state: SwapState) => state.me);

  const pendingRequests = useMemo(
    () => inbox.filter((request: RequestItem) => request.status === "PENDING").length,
    [inbox]
  );

  const upcomingSessions = useMemo(
    () =>
      sessions.filter((session: SessionItem) => {
        if (!session.startAt) {
          return false;
        }
        const sessionTime = new Date(session.startAt).getTime();
        return session.status === "scheduled" && sessionTime >= Date.now();
      }).length,
    [sessions]
  );

  const navItems = useMemo<NavItem[]>(
    () => [
      { key: "dashboard", label: "Dashboard", href: "/dashboard" },
      { key: "matches", label: "Find a Swap", href: "/matches" },
      { key: "requests", label: "Requests", href: "/requests", badge: pendingRequests },
      { key: "sessions", label: "Sessions", href: "/sessions", badge: upcomingSessions },
      { key: "chat", label: "Community Chat", href: "/chat" },
      { key: "ratings", label: "Ratings", href: "/ratings" },
      { key: "profile", label: "Profile", href: "/profile" },
    ],
    [pendingRequests, upcomingSessions]
  );

  const avatarInitial = useMemo(() => {
    if (me?.name) {
      return me.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "S";
  }, [me?.name, user?.email]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut();
    navigate("/signin");
  };

  const renderLink = (item: NavItem, inline = false, onActivate?: () => void) => {
    const isActive = !item.external && location.pathname.startsWith(item.href);
    const baseClass = classNames(
      "td-dashboard-nav__link",
      isActive && "td-dashboard-nav__link--active",
      inline && "td-dashboard-nav__link--inline"
    );

    const content = (
      <>
        <span>{item.label}</span>
        {(item.badge ?? 0) > 0 ? (
          <span aria-label={`${item.badge} new`} className="td-dashboard-nav__badge">
            {item.badge}
          </span>
        ) : null}
      </>
    );

    if (item.external) {
      return (
        <a href={item.href} className={baseClass} rel="noreferrer" onClick={onActivate}>
          {content}
        </a>
      );
    }

    return (
      <Link
        to={item.href}
        className={baseClass}
        aria-current={isActive ? "page" : undefined}
        onClick={onActivate}
      >
        {content}
      </Link>
    );
  };

  return (
    <header className="td-dashboard-nav" role="banner">
      <div className="container">
        <div className="td-dashboard-nav__layout">
          <div className="td-dashboard-nav__brand-group">
            <button
              type="button"
              className="td-dashboard-nav__mobile-toggle"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
            <Link to="/" className="td-dashboard-nav__brand">
              <img src="/assets/img/lg-2.png" alt="Swap — Knowledge Exchange" width={96} height={32} />
            </Link>
          </div>

          <nav className="td-dashboard-nav__links" aria-label="Primary">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>{renderLink(item)}</li>
              ))}
            </ul>
          </nav>

          <div className="td-dashboard-nav__actions">
            <div className="td-dashboard-nav__token" aria-label={`Available tokens ${tokenBalance}`}>
              <Wallet size={16} aria-hidden="true" />
              <span>{tokenBalance}</span>
            </div>
            <div
              className="td-dashboard-nav__avatar"
              aria-label={user ? `Signed in as ${user.email}` : "Swap"}
              title={user?.email ?? me?.email ?? ""}
            >
              {avatarInitial}
            </div>
            {user ? (
              <button type="button" className="td-dashboard-nav__signout td-btn td-btn-lg td-btn-outline" onClick={handleSignOut}>
                <LogOut size={16} aria-hidden="true" />
                <span>Sign out</span>
              </button>
            ) : (
              <Link to="/signin" className="td-dashboard-nav__signin td-btn td-btn-lg">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={classNames("td-dashboard-nav__mobile", mobileOpen && "is-open")}>
        <div className="td-dashboard-nav__mobile-panel">
          <div className="td-dashboard-nav__mobile-header">
            <Link to="/" className="td-dashboard-nav__mobile-brand" onClick={() => setMobileOpen(false)}>
              <img src="/assets/img/lg-2.png" alt="Swap" width={96} height={32} />
            </Link>
            <button
              type="button"
              className="td-dashboard-nav__mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <nav className="td-dashboard-nav__mobile-links" aria-label="Mobile">
            <ul>
              {navItems.map((item) => (
                <li key={`mobile-${item.key}`}>{renderLink(item, true, () => setMobileOpen(false))}</li>
              ))}
            </ul>
          </nav>
          <div className="td-dashboard-nav__mobile-footer">
            <div className="td-dashboard-nav__mobile-meta">
              <div className="td-dashboard-nav__avatar td-dashboard-nav__avatar--mobile">{avatarInitial}</div>
              <div>
                <p className="td-dashboard-nav__mobile-email">{me?.email ?? user?.email ?? ""}</p>
                <p className="td-dashboard-nav__mobile-tokens">{tokenBalance} tokens available</p>
              </div>
            </div>
            {user ? (
              <button type="button" className="td-dashboard-nav__mobile-signout td-btn td-btn-outline" onClick={handleSignOut}>
                <LogOut size={18} aria-hidden="true" />
                <span>Sign out</span>
              </button>
            ) : (
              <Link to="/signin" className="td-dashboard-nav__mobile-signout td-btn" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavigation;
