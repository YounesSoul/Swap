import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { supabaseClient } from "../lib/supabaseClient";
import { buildSwapAppUrl } from "../config/appRoutes";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const callbackParam = searchParams.get("callbackUrl");
	const fallbackDestination = "/dashboard";
	const destination = callbackParam && callbackParam.trim().length > 0 ? callbackParam : fallbackDestination;

	const redirectToDestination = (target: string) => {
		if (/^https?:\/\//i.test(target)) {
			window.location.href = target;
			return;
		}

		const normalized = target.startsWith("/") ? target : `/${target}`;
		window.location.href = buildSwapAppUrl(normalized);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (loading) return;

		setLoading(true);
		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			toast.error(error.message || "Invalid email or password");
			return;
		}

		toast.success("Signed in! Redirecting...");
		redirectToDestination(destination);
	};

	const handleOAuthSignIn = async (provider: "google" | "azure") => {
		if (loading) return;
		setLoading(true);

		const { error } = await supabaseClient.auth.signInWithOAuth({
			provider: provider === "azure" ? "azure" : "google",
			options: {
				redirectTo: buildSwapAppUrl(`/auth/callback?next=${encodeURIComponent(destination)}`),
			},
		});

		if (error) {
			setLoading(false);
			toast.error(error.message || "Could not start sign in");
		}
	};

	return (
		<section className="td-auth-area td-section-spacing p-relative z-index-1">
			<img
				className="td-auth-shape td-auth-shape-1 d-none d-xl-block"
				src="/assets/img/hero/shape.png"
				alt=""
				aria-hidden="true"
			/>
			<img
				className="td-auth-shape td-auth-shape-2 d-none d-lg-block"
				src="/assets/img/cta/cta.png"
				alt=""
				aria-hidden="true"
			/>

			<div className="container">
				<div className="row align-items-center justify-content-between">
					<div className="col-xl-5 col-lg-6 mb-5 mb-lg-0">
						<div className="td-auth-copy">
							<span className="td-auth-badge">Sign in</span>
							<h2 className="td-auth-title">Pick up where you left off</h2>
							<p className="td-auth-text">
								Manage live requests, reconnect with your matches, and keep building momentum inside the student-led Swap
								community.
							</p>
							<ul className="td-auth-list">
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>See every accepted exchange and upcoming session at a glance.</span>
								</li>
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>Jump back into chats with instant access to transcripts.</span>
								</li>
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>Stay aligned with agreed time slots and community updates.</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="col-xl-5 col-lg-5">
						<div className="td-auth-card td-rounded-10">
							<h3 className="td-auth-card-title">Sign in to Swap</h3>
							<p className="td-auth-card-subtitle">Choose the quickest way to reconnect with your learning circle.</p>

							<div className="td-auth-sso">
											<button
												type="button"
												className="td-auth-sso-btn"
												aria-label="Continue with Google"
												disabled={loading}
												onClick={() => handleOAuthSignIn("google")}
											>
									<span className="td-auth-sso-icon"><i className="fa-brands fa-google"></i></span>
									Continue with Google
								</button>
											<button
												type="button"
												className="td-auth-sso-btn"
												aria-label="Continue with Microsoft"
												disabled={loading}
												onClick={() => handleOAuthSignIn("azure")}
											>
									<span className="td-auth-sso-icon"><i className="fa-brands fa-microsoft"></i></span>
									Continue with Microsoft
								</button>
							</div>

							<div className="td-auth-divider"><span>Or sign in with email</span></div>

									<form className="td-auth-form" onSubmit={handleSubmit}>
								<div className="td-auth-field">
									<label className="td-auth-label" htmlFor="signin-email">
										University email
									</label>
									<input
										className="td-auth-input"
										id="signin-email"
										type="email"
										placeholder="your-email@student.university.edu"
												value={email}
												onChange={(event) => setEmail(event.target.value)}
										required
									/>
								</div>
								<div className="td-auth-field">
									<label className="td-auth-label" htmlFor="signin-password">
										Password
									</label>
									<input
										className="td-auth-input"
										id="signin-password"
										type="password"
										placeholder="Enter your password"
												value={password}
												onChange={(event) => setPassword(event.target.value)}
										required
									/>
								</div>

								<div className="td-auth-inline">
									<label className="td-auth-checkbox">
										<input type="checkbox" />
										<span>Keep me signed in</span>
									</label>
									<Link to="/contact" className="td-auth-link">
										Forgot password?
									</Link>
								</div>

													<button className="td-auth-submit" type="submit" disabled={loading} aria-busy={loading}>
														{loading ? "Signing in..." : "Sign In"}
								</button>
							</form>

							<div className="td-auth-meta">
													New to Swap?{" "}
								<Link to="/register" className="td-auth-link">
									Create an account
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignIn;
