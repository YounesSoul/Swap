import React, { type JSX, useRef } from "react";
import useGsapAnimation from "../../../hooks/useGsapAnimation";

interface DataType {
  id: number;
  count: string;
  title: JSX.Element;
  list: string[];
}

const process_list: DataType[] = [
  {
    id: 1,
    count: "01",
    title: (<>Create & <br /> <span>Profile</span></>),
    list: [
      "List skills you can teach",
      "Select skills you want to learn",
      "Set your goals & availability",
    ],
  },
  {
    id: 2,
    count: "02",
    title: (<>Smart & <br /> <span>Matching</span></>),
    list: [
      "AI suggests ideal partners",
      "Filter by level & interests",
      "Review profiles & connect",
    ],
  },
  {
    id: 3,
    count: "03",
    title: (<>Schedule & <br /> <span>Start</span></>),
    list: [
      "Book a time that fits both",
      "Share materials & prepare",
      "Kick off your first session",
    ],
  },
  {
    id: 4,
    count: "04",
    title: (<>Exchange & <br /> <span>Grow</span></>),
    list: [
      "Teach what you know",
      "Learn what you need",
      "Track progress & iterate",
    ],
  },
];

const Process = () => {

  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const pinRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  useGsapAnimation({
    triggerRef,
    pinRef,
  });

  return (
    <div className="td-process-area pt-130 pb-160">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="td-service-title-wrap pb-10">
              <h2 className="td-section-title mb-0 td-text-invert">How It</h2>
              <h3 className="td-section-title-capi td-text-invert">Works</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="td-process-border td-fixed-thumb-wrap" ref={triggerRef}>
          <div className="row">
            <div className="col-lg-3">
              <div className="td-process-thumb pt-80 pb-80 td-fixed-thumb" ref={pinRef}>
                <img src="/assets/img/4444.jpg" alt="" />
              </div>
            </div>
            <div className="col-lg-9">
              {process_list.map((item) => (
                <div key={item.id} className="row">
                  <div className="col-lg-2 col-md-3 col-3">
                    <div className="td-process-count">
                      <span>{item.count}</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-4 col-9">
                    <div className="td-process-title">
                      <h3 className="mb-0">{item.title}</h3>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-5">
                    <div className="td-process-list">
                      <ul>
                        {item.list.map((list, i) => (
                          <li key={i}>{list}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Process