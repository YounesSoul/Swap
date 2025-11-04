import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import useGsapSmoother from "../hooks/useGsapSmoother";
import useImageRevealAnimation from "../hooks/useImageRevealAnimation";
import useSplitTextTitleAnim from "../hooks/useSplitTextTitleAnim";
import useSplitTextBgAnim from "../hooks/useSplitTextBgAnim";
import ScrollToTop from "../components/common/ScrollToTop";
import CustomCursor from "../components/common/CustomCursor";

type WrapperProps = {
  children: ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  // Custom GSAP animations
  useGsapSmoother();
  useImageRevealAnimation();
  useSplitTextTitleAnim();
  useSplitTextBgAnim();

  return (
    <>
      {children}
      <ScrollToTop />
      <CustomCursor />
      <ToastContainer position="top-center" />
    </>
  );
};

export default Wrapper;
