import React from "react";
import MainPic from "../../public/MainPic.jpg";
import Image from "next/image";

const Main = () => {
  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center lg:flex-row">
      <div
        className="w-full lg:w-1/2 h-full flex justify-end items-center flex-col px-10"
        data-aos="fade-up"
        data-aos-duration="400"
      >
        <div className="w-3/4 lg:w-4/5 text-center lg:text-left space-y-5">
          <h1 className="font-bold text-4xl md:text-7xl">
          Grow With
          <br />
          Evolve Tech
          </h1>
          <p className="text-md">
          Flexible work options in a company that values your development.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full">
            More Details
          </button>
          <div className="flex flex-col lg:flex-row space-y-2 justify-center lg:justify-start items-center space-x-4">
            <input
              type="text"
              className="px-3 py-1 rounded-full ring-2 ring-blue-500 focus:ring-4 outline-none placeholder:text-sm"
              placeholder="Subscribe to the NewsLetter"
            />
            <button className="w-fit px-3 py-1 rounded-full bg-orange-400 hover:bg-orange-500 font-semibold text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div
        className="w-full lg:w-1/2 p-10 md:p-16 lg:p-24 h-full flex justify-center items-center md:items-start relative"
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Image
          src={MainPic}
          alt="Home Pic"
          className="w-full h-full object-cover rounded-xl border-white border-4"
        />
      </div>
    </main>
  );
};

export default Main;
