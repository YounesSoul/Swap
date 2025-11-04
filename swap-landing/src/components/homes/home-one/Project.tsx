import { Link } from "react-router-dom";
import { useRef } from "react";

import useGsapAnimation from "../../../hooks/useGsapAnimation";

interface DataType {
   id: number;
   class: string;
   class_2: string;
   thumb: string;
   title: string;
}

const project_data: DataType[] = [
   {
      id: 1,
      class: "mr-30",
      class_2: "col-lg-4 col-md-6",
      thumb: "/assets/img/project/product.jpg",
      title: "Developed visionary Designs with spectacular ideas"
   },
   {
      id: 2,
      class: "two pt-195 ml-100 mr-100",
      class_2: "col-lg-4 col-md-6",
      thumb: "/assets/img/project/product-2.jpg",
      title: "Product Design is which a brand is created"
   },
   {
      id: 3,
      class: "three pt-175 ml-70",
      class_2: "col-lg-4 col-md-6",
      thumb: "/assets/img/project/product-3.jpg",
      title: "Branding is very needed for tech"
   },
   {
      id: 4,
      class: "four pt-85",
      class_2: "col-lg-6 col-md-6",
      thumb: "/assets/img/project/product-4.jpg",
      title: "Graphics Design in which a brand is created"
   },
   {
      id: 5,
      class: "five",
      class_2: "col-lg-6 col-md-12",
      thumb: "/assets/img/project/product-5.jpg",
      title: "Creativity comes when we give best efforts"
   },
];

const Project = () => {

   const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
   const pinRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
   useGsapAnimation({
      triggerRef,
      pinRef,
   });

   return (
      <div className="td-project-area td-fixed-title-wrap z-index-1 p-relative pt-155 pb-95" style={{ backgroundImage: `url(/assets/img/project/bg.jpg)` }} ref={triggerRef}>
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="td-project-title text-center pb-80 td-fixed-title z-index-m-1" ref={pinRef}>
                     <span className="subtitle d-inline-block mb-15">OUR PROJECT WE HAVE DONE</span>
                     <h2 className="title">See Our Recent<br /><span>Projects</span></h2>
                  </div>
               </div>
               {project_data.map((item) => (
                  <div key={item.id} className={item.class_2}>
                     <div className={`td-project-item mb-30 ${item.class}`}>
                        <div className="td-project-thumb mb-25">
                           <img className="w-100" src={item.thumb} alt="" />
                        </div>
                        <div className="td-project-content">
                           <Link to="/portfolio-details">
                              <span className="mr-40">{item.title}</span>
                              <span className="icon">
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </span>
                           </Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Project
