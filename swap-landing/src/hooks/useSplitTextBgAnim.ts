import { useLayoutEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const useSplitTextBgAnim = () => {
   useLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const elements = document.querySelectorAll(".td-text-invert, .td-text-opacity");
         if (!elements.length) return;

         elements.forEach((el) => {
            const split = new SplitText(el as HTMLElement, { type: "lines" });

            split.lines.forEach((line) => {
               gsap.to(line, {
                  backgroundPositionX: 0,
                  ease: "none",
                  scrollTrigger: {
                     trigger: line,
                     scrub: 1,
                     start: "top 85%",
                     end: "bottom center",
                  },
               });
            });
         });
      });

      return () => ctx.revert();
   }, []);
};

export default useSplitTextBgAnim;
