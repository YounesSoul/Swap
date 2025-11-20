import Hero from "./Hero"
import About from "./About"
import Service from "./Service"
// import Project from "./Project"
import Process from "./Process"
import Testimonial from "./Testimonial"
import Blog from "./Blog"
import Cta from "./Cta"
import Footer from "./Footer"
import Header from "./Header"

const HomeOne = () => {
   return (
      <>
         <Header/>
         <div id="smooth-wrapper">
            <div id="smooth-content">
               <main>
                  <Hero />
                  <About />
                  <Service />

                  <Process />
                  <Testimonial />
                  <Blog />
                  <Cta />
               </main>
               <Footer style={true} />
            </div>
         </div>
      </>
   )
}

export default HomeOne
