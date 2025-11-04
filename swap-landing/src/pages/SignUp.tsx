import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabaseClient } from "../lib/supabaseClient";
import { buildSwapAppUrl } from "../config/appRoutes";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const callbackParam = searchParams.get("callbackUrl");
	const fallbackDestination = "/onboarding";
	const destination = callbackParam && callbackParam.trim().length > 0 ? callbackParam : fallbackDestination;

	const redirectToDestination = (target: string) => {
		if (/^https?:\/\//i.test(target)) {
			window.location.href = target;
			return;
		}

		const normalized = target.startsWith("/") ? target : `/${target}`;
		window.location.href = buildSwapAppUrl(normalized);
	};

	const handleOAuthSignUp = async (provider: "google" | "azure") => {
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
			toast.error(error.message || "Could not start sign up");
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (loading) return;

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);

		const { data, error } = await supabaseClient.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					date_of_birth: dateOfBirth || undefined,
					full_name: `${firstName} ${lastName}`.trim(),
				},
				emailRedirectTo: buildSwapAppUrl(`/auth/callback?next=${encodeURIComponent(destination)}`),
			},
		});

		setLoading(false);

		if (error) {
			toast.error(error.message || "Could not create account");
			return;
		}

		if (data?.user && data?.session) {
			toast.success("Account created! Redirecting you now...");
			redirectToDestination(destination);
			return;
		}

		if (data?.user && !data?.session) {
			toast.success("Account created! Please confirm via email.");
			navigate(`/signin?callbackUrl=${encodeURIComponent(destination)}`);
			return;
		}

		toast.success("Account created! You can sign in now.");
		navigate("/signin");
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
				src="/assets/img/cta/cta-2.png"
				alt=""
				aria-hidden="true"
			/>

			<div className="container">
				<div className="row align-items-center justify-content-between">
					<div className="col-xl-5 col-lg-6 mb-5 mb-lg-0">
						<div className="td-auth-copy">
							<span className="td-auth-badge">Join Swap</span>
							<h2 className="td-auth-title">Exchange knowledge with peers worldwide</h2>
							<p className="td-auth-text">
								Create your free profile, match instantly with complementary skills, and start learning without fees or
								friction.
							</p>
							<ul className="td-auth-list">
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>Share what you know and request the skills you want in minutes.</span>
								</li>
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>Let Swap’s smart matching connect you with the right partner.</span>
								</li>
								<li>
									<i className="fa-sharp fa-solid fa-check"></i>
									<span>Use built-in scheduling, transcripts, and ratings to stay organised.</span>
								</li>
							</ul>

							<div className="td-auth-highlight">
								<div>
									<strong>2,500+</strong>
									<span>students already inside</span>
								</div>
								<div>
									<strong>150+</strong>
									<span>skills available to swap</span>
								</div>
							</div>
						</div>
					</div>

					<div className="col-xl-5 col-lg-5">
						<div className="td-auth-card td-rounded-10">
							<h3 className="td-auth-card-title">Create your Swap account</h3>
							<p className="td-auth-card-subtitle">It only takes a minute to unlock community-powered learning.</p>

							<div className="td-auth-sso">
												<button
													type="button"
													className="td-auth-sso-btn"
													aria-label="Sign up with Google"
													disabled={loading}
													onClick={() => handleOAuthSignUp("google")}
												>
									<span className="td-auth-sso-icon"><i className="fa-brands fa-google"></i></span>
									Sign up with Google
								</button>
												<button
													type="button"
													className="td-auth-sso-btn"
													aria-label="Sign up with Microsoft"
													disabled={loading}
													onClick={() => handleOAuthSignUp("azure")}
												>
									<span className="td-auth-sso-icon"><i className="fa-brands fa-microsoft"></i></span>
									Sign up with Microsoft
								</button>
							</div>

							<div className="td-auth-divider"><span>Or use your email</span></div>

											<form className="td-auth-form" onSubmit={handleSubmit}>
								<div className="td-auth-field">
									<label className="td-auth-label" htmlFor="signup-email">
										University email
									</label>
									<input
										className="td-auth-input"
										id="signup-email"
										type="email"
										placeholder="your-email@student.university.edu"
														value={email}
														onChange={(event) => setEmail(event.target.value)}
										required
									/>
								</div>

								<div className="td-auth-double">
									<div className="td-auth-field">
										<label className="td-auth-label" htmlFor="signup-first-name">
											First name
										</label>
															<input
																className="td-auth-input"
																id="signup-first-name"
																type="text"
																placeholder="First name"
																value={firstName}
																onChange={(event) => setFirstName(event.target.value)}
																required
															/>
									</div>
									<div className="td-auth-field">
										<label className="td-auth-label" htmlFor="signup-last-name">
											Last name
										</label>
															<input
																className="td-auth-input"
																id="signup-last-name"
																type="text"
																placeholder="Last name"
																value={lastName}
																onChange={(event) => setLastName(event.target.value)}
																required
															/>
									</div>
								</div>

								<div className="td-auth-field">
									<label className="td-auth-label" htmlFor="signup-dob">
										Date of birth <span className="td-auth-label-optional">(optional)</span>
									</label>
														<input
															className="td-auth-input"
															id="signup-dob"
															type="date"
															value={dateOfBirth}
															onChange={(event) => setDateOfBirth(event.target.value)}
														/>
								</div>

								<div className="td-auth-double">
									<div className="td-auth-field">
										<label className="td-auth-label" htmlFor="signup-password">
											Password
										</label>
										<input
											className="td-auth-input"
											id="signup-password"
											type="password"
											placeholder="Create a secure password"
																value={password}
																onChange={(event) => setPassword(event.target.value)}
											required
										/>
									</div>
									<div className="td-auth-field">
										<label className="td-auth-label" htmlFor="signup-confirm-password">
											Confirm password
										</label>
										<input
											className="td-auth-input"
											id="signup-confirm-password"
											type="password"
											placeholder="Re-enter password"
																	value={confirmPassword}
																	onChange={(event) => setConfirmPassword(event.target.value)}
											required
										/>
									</div>
								</div>

								<label className="td-auth-checkbox">
									<input type="checkbox" required />
									<span>
															I agree to the{" "}
										<Link to="/terms" className="td-auth-link">
											Terms
															</Link>{" "}
															and{" "}
										<Link to="/privacy" className="td-auth-link">
											Privacy Policy
										</Link>
									</span>
								</label>

													<button className="td-auth-submit" type="submit" disabled={loading} aria-busy={loading}>
														{loading ? "Creating account..." : "Create account"}
								</button>
							</form>

							<div className="td-auth-meta">
													Already have an account?{" "}
								<Link to="/signin" className="td-auth-link">
									Sign in
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignUp;
