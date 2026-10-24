import { Inter, Mulish } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer ";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

const mulish = Mulish({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Evolve Tech | Build the Future with Us",
  description: "Evolve Tech | Build the Future with Us",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${mulish.className} scrollbar-hide`}>
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
