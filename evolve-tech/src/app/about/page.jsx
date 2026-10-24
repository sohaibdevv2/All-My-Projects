import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <main className="w-full h-4/5 p-8 md:p-12 lg:p-16 flex flex-col space-y-8">
      <h1 className="font-bold text-5xl text-center">Our Little Detail</h1>
      <div className="w-full flex flex-col lg:flex-row space-y-2">
        {/* Left Box */}
        <div className="w-full h-full flex-1 flex justify-center items-center">
          <div
            className="w-full h-full mx-2 sm:mx-4 md:mx-8 lg:mx-24 lg:my-10"
            data-aos="fade-right"
            data-aos-duration="400"
          >
            <div className="w-full h-full flex justify-center items-center relative">
              <Image src="/about.avif" alt="Work image" width={500} height={1} />
            </div>
          </div>
        </div>

        {/* Right Box */}
        {/* Feedback Form */}
        <div className="w-full lg:flex-1 flex justify-center items-center">
          <div
            className="inputBox p-8 rounded-md shadow-md max-w-lg mx-auto"
            data-aos="fade-left"
            data-aos-duration="400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Established Date:
                </label>
                <p className="text-lg font-semibold">January 1, 2000</p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Total Workers:
                </label>
                <p className="text-lg font-semibold">150+</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Address:
              </label>
              <p className="text-lg font-semibold">
                123 Company Street, Karachi, Pakistan
              </p>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Office Time:
              </label>
              <p className="text-lg font-semibold">9-5</p>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Off Days:
              </label>
              <p className="text-lg font-semibold">Saturday-Sunday</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
