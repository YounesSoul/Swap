import { useLayoutEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const useSplitTextTitleAnim = () => {
   useLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const elements = document.querySelectorAll(".td-title-anim");
         if (!elements.length) return;

         elements.forEach((el) => {
            const tl = gsap.timeline({
               scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  end: "bottom 60%",
                  scrub: false,
                  markers: false,
                  toggleActions: "play none none none",
               },
            });

            const split = new SplitText(el as HTMLElement, { type: "words,lines" });
            gsap.set(el, { perspective: 300 });

            split.split({ type: "lines" });

            tl.from(split.lines, {
               duration: 1,
               delay: 0.3,
               opacity: 0,
               rotationX: -50,
               force3D: true,
               transformOrigin: "top center -50",
               stagger: 0.2,
            });
         });
      });

      return () => ctx.revert();
   }, []);
};

export default useSplitTextTitleAnim;
