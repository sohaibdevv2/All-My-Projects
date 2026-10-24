"use client";
import Facilities from "@/components/Facilities";
import Feedback from "@/components/Feedback";
import Main from "@/components/Main";
import ThankYou from "@/components/ThankYou";
import Work from "@/components/Work";
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    Aos.init({
      offset: 200,
      duration: 600,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);
  return (
    <main className="max-w-screen">
      <Main />
      <Work />
      <Facilities />
      <Feedback />
      <ThankYou />
    </main>
  );
}
