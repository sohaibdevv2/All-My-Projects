"use client";
import Image from "next/image";
import React from "react";

const Feedback = () => {
  return (
    <main className="w-full h-fit flex justify-center items-center px-10 flex-col space-y-2">
      <div>
        <h1 className="font-bold text-4xl text-center">
          Your Feedback Matters
        </h1>
        <div className="w-full flex flex-col lg:flex-row space-y-2">
          {/* Left Box */}
          <div className="w-full h-full flex-1 flex justify-center items-center">
            <div
              className="w-full h-full mx-2 sm:mx-4 md:mx-8 lg:mx-24 lg:my-20"
              data-aos="fade-right"
              data-aos-duration="400"
            >
              <div className="w-full h-full flex justify-center items-center relative">
                <Image
                  src="/feedback.avif"
                  alt="Work image"
                  width={600}
                  height={1}
                />
              </div>
            </div>
          </div>

          {/* Right Box */}
          {/* Feedback Form */}
          <div className="w-full lg:flex-1 flex justify-center items-center">
            <div
              className="inputBox w-full max-w-md p-8 rounded-md"
              data-aos="fade-left"
              data-aos-duration="400"
            >
              <h2 className="text-2xl font-bold mb-4">Give Us Feedback</h2>
              <form>
                <label htmlFor="feedback" className="block mb-2">
                  Your Feedback:
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows="4"
                  className="inputField w-full p-2 mb-4 border rounded-md"
                />

                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feedback;
