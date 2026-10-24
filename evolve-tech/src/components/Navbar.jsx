"use client";
import { salsa } from "@/app/fonts";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  return (
    <nav className="w-full h-16 flex justify-between items-center py-3 md:py-6 px-5 md:px-20">
      {/* Navbar for small devices (mobile screens) */}
      <div className="md:hidden flex justify-between w-full items-center">
        <Link href={"/"} className={`font-bold text-4xl ${salsa.className}`}>
          Evolve<span className="text-blue-500 italic">Tech</span>
        </Link>
        {/* Hamburger/Cross icon */}
        <div className="flex space-x-4 justify-center items-center">
          {showMenu ? (
            <FaTimes
              onClick={toggleMenu}
              className="text-blue-500 text-2xl cursor-pointer"
            />
          ) : (
            <FaBars
              onClick={toggleMenu}
              className="text-blue-500 text-2xl cursor-pointer"
            />
          )}
        </div>
        {/* Dropdown menu */}
        {showMenu && (
          <div className="md:hidden absolute top-12 left-0 right-0 text-center font-bold dark:bg-white dark:text-black z-10 p-4 shadow-md space-y-2">
            <Link href={"/"} className="block mb-2 hover:text-blue-500">
              Home
            </Link>
            <Link href={"/about"} className="block mb-3 hover:text-blue-500">
              About
            </Link>
            <Link href={"/contact"} className="block mb-3 hover:text-blue-500">
              Contact
            </Link>
            <Link href={"/feedback"} className="block hover:text-blue-500">
              Feedback
            </Link>
            <Link href={"/signin"} className="block text-blue-500 hover:text-blue-300">
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Navbar for medium/large devices (desktop screens) */}
      <div className="hidden md:flex justify-between items-center w-full space-x-6 font-semibold">
        <Link href={"/"} className={`font-bold text-4xl ${salsa.className}`}>
         Evolve<span className="text-blue-500 italic">Tech</span>
        </Link>
        {/* Navigation links */}
        <div className="flex space-x-6 font-bold">
          <Link className="hover:text-blue-500" href={"/"}>Home</Link>
          <Link className="hover:text-blue-500" href={"/about"}>About</Link>
          <Link className="hover:text-blue-500" href={"/contact"}>Contact</Link>
          <Link className="hover:text-blue-500" href={"/feedback"}>Feedback</Link>
        </div>
        {/* Sign In button */}
        <div className="flex space-x-4 justify-center items-center">
          <Link
            href={"/signin"}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;