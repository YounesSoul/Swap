import { Link } from "react-router-dom";

const included: string[] = [
   "Unlimited knowledge exchanges",
   "AI-powered smart matching",
   "Community access",
   "Session scheduling",
   "Progress tracking",
   "Mobile access",
];

const Blog = () => {
   return (
      <div className="td-pricing-area pt-155 pb-130">
         <div className="container">
            {/* header */}
            <div className="row mb-50">
               <div className="col-lg-3">
                  <div className="mb-20">
                     <span className="td-section-subtitle">PRICING</span>
                  </div>
               </div>
               <div className="col-lg-5">
                  <div>
                     <h2 className="td-testimonial-title mb-30 td-text-invert">
                        Simple, Transparent <br /> <span>Pricing</span>
                     </h2>
                  </div>
               </div>
               <div className="col-lg-4">
                  <div className="mb-30">
                     <p className="mb-35">
                        Knowledge exchange shouldn’t cost a fortune. That’s why Swap is completely free.
                     </p>
                     <div className="td-btn-group">
                        <Link className="td-btn-circle" to="/register">
                           <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link className="td-btn-2 td-btn-primary" to="/register">Start Free</Link>
                        <Link className="td-btn-circle" to="/register">
                           <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* card */}
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7">
                  <div className="td-pricing-card td-rounded-10  p-40 mb-30">
                     <div className="d-flex align-items-end justify-content-between mb-25">
                        <div>
                           <h3 className="td-text-invert mb-5">Free</h3>
                           <span className="d-inline-block">Forever</span>
                        </div>
                        <div className="text-right">
                           <div className="td-text-invert" style={{ fontSize: 48, lineHeight: 1, fontWeight: 700 }}>$0</div>
                           <div>no credit card</div>
                        </div>
                     </div>

                     <div className="td-border d-block mb-25" style={{ height: 1 }}></div>

                     <ul className="mb-30">
                        {included.map((f, i) => (
                           <li key={i} className="d-flex align-items-center mb-15">
                              <span className="mr-10 d-inline-flex align-items-center justify-content-center" aria-hidden>
                                 <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                 </svg>
                              </span>
                              {f}
                           </li>
                        ))}
                     </ul>

                     <div className="td-btn-group">
                        <Link className="td-btn-circle" to="/register">
                           <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link className="td-btn-2 td-btn-primary" to="/register">Join the Community</Link>
                        <Link className="td-btn-circle" to="/register">
                           <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                     </div>

                     <p className="mt-20">100% Free • No money required • Pure skill exchange</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Blog;