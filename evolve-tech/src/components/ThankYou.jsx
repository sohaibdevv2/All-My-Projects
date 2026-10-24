import Image from "next/image";
import React from "react";

const ThankYou = () => {
  return (
    <main className="w-full flex justify-center items-center flex-col space-y-2 px-8 pt-12">
      <h1 className="font-bold text-5xl text-center">Thanks For Visiting Us</h1>
      <div className="w-full flex flex-col lg:flex-row space-y-2">
        {/* Left Box */}
        <div className="w-full h-full flex-1 flex justify-center items-center">
          <div
            className="w-full h-full mx-2 sm:mx-4 md:mx-8 lg:mx-24 lg:my-10"
            data-aos="fade-right"
            data-aos-duration="400"
          >
            <div className="w-full h-full flex justify-center items-center relative">
              <Image
                src="/thankyou.jpg"
                alt="Work image"
                width={500}
                height={1}
              />
            </div>
          </div>
        </div>

        {/* Right Box */}
        {/* Feedback Form */}
        <div className="w-full lg:flex-1 flex justify-center items-center">
          <div
            className=" flex justify-center items-center lg:items-start flex-col space-y-4"
            data-aos="fade-left"
            data-aos-duration="400"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-center lg:text-start text-red-400">
              Don't Waste Your Precious Time.
            </h1>
            <h2 className="font-semibold text-slate-500 text-xl sm:text-2xl lg:text-3xl">
              Join Your New Journey
            </h2>
            <h3 className="font-semibold text-slate-500 text-xl sm:text-2xl lg:text-3xl">
              With Us.
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
