import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import SplitText from "gsap/SplitText";

const useGsapSmoother = () => {
   useEffect(() => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);
      gsap.config({ nullTargetWarn: false });

      const wrapper = document.querySelector("#smooth-wrapper");
      const content = document.querySelector("#smooth-content");

      let smoother: ScrollSmoother | null = null;

      if (wrapper && content) {
         smoother = ScrollSmoother.create({
            wrapper,
            content,
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
         });
      }

      const headline = document.querySelector(".split-text");
      let split: SplitText | null = null;

      if (headline) {
         split = new SplitText(headline, { type: "lines", linesClass: "split-line" });

         gsap.from(split.lines, {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: headline, start: "top 80%" },
         });
      }

      const btn = document.querySelector(".scroll-to-bottom");
      const handleClick = () => {
         gsap.to(window, { duration: 1, scrollTo: { y: "#target-section", offsetY: 100 } });
      };
      if (btn) btn.addEventListener("click", handleClick);

      return () => {
         if (split) split.revert();
         ScrollTrigger.getAll().forEach((t) => t.kill());
         if (btn) btn.removeEventListener("click", handleClick);
         if (smoother) smoother.kill();
      };
   }, []);
};

export default useGsapSmoother;
