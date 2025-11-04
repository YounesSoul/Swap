import { Link } from "react-router-dom"
import Count from "../../common/Count";

const service_data = [
  { title: "Knowledge Exchange", link: "/features/knowledge-exchange" },
  { title: "Smart Matching", link: "/features/smart-matching" },
  { title: "Community Hub", link: "/features/community-hub" },
  { title: "Flexible Scheduling", link: "/features/flexible-scheduling" },
];

const Service = () => {
  return (
    <div className="td-service-area pb-100 pt-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="td-service-title-wrap">
              <h2 className="td-section-title mb-30 td-text-invert">Exchange Skills</h2>
              <p className="td-section-text mr-200">
                Connect with peers to share what you know and learn what you need—no payments, just a fair exchange of skills inside a supportive student community.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-5">
            <div className="td-service-btn mt-35 ml-110 mb-30">
              <div className="td-btn-group mb-35">
                <Link className="td-btn-circle" to="/service">
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link className="td-btn-2 td-btn-primary" to="/service">Explore Skills</Link>
                <Link className="td-btn-circle" to="/service">
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="td-service-content">
              {service_data.map((item, i) => (
                <Link key={i} className="td-service-item" to={item.link}>
                  {item.title}
                  <span>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.5853 0.21498C23.9612 0.160838 24.2991 0.257578 24.5256 0.48404C24.752 0.710503 24.8488 1.04839 24.7946 1.42432L22.1319 19.3631C22.068 19.7386 21.8634 20.1177 21.5604 20.4225C21.408 20.5739 21.236 20.7028 21.0532 20.8023C20.7801 20.9458 20.4931 21.0143 20.2286 20.9994C19.9642 20.9844 19.734 20.8866 19.5672 20.7184L12.7779 13.9291L2.47712 24.2298C2.17357 24.5334 1.79306 24.7351 1.41925 24.7906C1.04545 24.846 0.709012 24.7508 0.483922 24.5257C0.25885 24.3006 0.163565 23.9641 0.219059 23.5904C0.274536 23.2166 0.47625 22.836 0.779796 22.5325L11.0806 12.2317L4.29122 5.44239C4.12296 5.27556 4.0252 5.04541 4.01025 4.78096C3.9953 4.51651 4.06385 4.22958 4.20722 3.95636C4.35748 3.68382 4.5724 3.43787 4.82713 3.24697C5.08184 3.05609 5.36593 2.92807 5.64654 2.87772L23.5853 0.21498Z" fill="currentColor" />
                    </svg>
                  </span>
                </Link>
              ))}
              <div className="td-service-counter mt-80">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="td-service-counter-item mb-30">
                      <h2><span className="odometer" data-count="2500"> <Count number={2500} /></span>+</h2>
                      <span>Active Learners</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="td-service-counter-item mb-30">
                      <h2><span className="odometer" data-count="150"> <Count number={150} /></span>+</h2>
                      <span>Skills Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Service