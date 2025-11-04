import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className="td-about-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="td-about-left mb-30">
              <span>WHO WE ARE</span>
              <div className="td-about-left-thumb ml-60 fix td-rounded-10">
                <img data-speed=".9" src="/assets/img/about/tutor.jpg" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="td-about-content mb-30">
              <h2 className="td-about-title mb-30">
                We help students exchange skills and knowledge—no payments, just fair peer-to-peer learning.
              </h2>
              <p className="mb-45">
                Swap is a student-first community where you share what you know and learn what you need. Our AI-powered
                matching connects you with the right partners, while built-in scheduling and a supportive community make
                collaboration effortless. Whether you want to level up in coding, design, languages, or exam prep, you
                can teach, learn, and grow—together.
              </p>
              <div className="td-btn-group mb-35">
                <Link className="td-btn-circle" to="/about">
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link className="td-btn-2 td-btn-primary" to="/about">ABOUT SWAP</Link>
                <Link className="td-btn-circle" to="/about">
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="td-about-thumb-wrap d-flex align-items-center justify-content-end">
                <div className="mr-150 td-about-shape">
                  <img className="td-live-anim-spin" src="/assets/img/about/shape.png" alt="" />
                </div>
                <div className="td-about-thumb fix td-rounded-10">
                  <img data-speed=".9" src="/assets/img/img-11.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About