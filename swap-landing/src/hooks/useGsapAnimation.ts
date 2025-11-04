import { useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

interface UseGsapAnimationProps {
   triggerRef: React.RefObject<HTMLDivElement>;
   pinRef: React.RefObject<HTMLDivElement>;
   start?: string;
   end?: string;
   scrub?: number;
   pinSpacing?: boolean;
   mediaQuery?: string;
}

const useGsapAnimation = ({
   triggerRef,
   pinRef,
   start = 'top center-=350',
   end = 'bottom 65%',
   scrub = 1,
   pinSpacing = false,
   mediaQuery = '(min-width: 992px)',
}: UseGsapAnimationProps) => {
   useEffect(() => {
      const mm = gsap.matchMedia();

      mm.add(mediaQuery, () => {
         if (triggerRef.current && pinRef.current) {
            gsap.timeline({
               scrollTrigger: {
                  trigger: triggerRef.current,
                  start,
                  end,
                  pin: pinRef.current,
                  scrub,
                  pinSpacing,
                  markers: false,
               }
            });
         }
      });

      return () => mm.revert();
   }, [triggerRef, pinRef, start, end, scrub, pinSpacing, mediaQuery]);
};

export default useGsapAnimation;
