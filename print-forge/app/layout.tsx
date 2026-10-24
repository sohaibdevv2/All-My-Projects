import "./globals.css";
import { RootLayoutProps } from "./type/index";
import Link from "next/link";
import Image from "next/image";
import { Albert_Sans, Montserrat_Alternates } from "next/font/google"

const albertSans = Albert_Sans({
  subsets: ["latin"],
  display: "swap"
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat-alternates"
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${albertSans.className} ${montserratAlternates.className}`}>
        <header className="w-full bg-white">
          <nav className="flex justify-between px-6 py-4">
              {/* Desktop logo */}
              <Link href={"/"}>
              <Image
                src="/printforge-logo.svg"
                alt="PrintForge Logo"
                width={200}
                height={40}
                className="w-[200px] h-auto hidden md:block"
                priority
              />
              {/* Mobile logo */}
              <Image
                src="/printforge-logo-icon.svg"
                alt="PrintForge Logo"
                width={40}
                height={40}
                className="w-[40px] h-auto block md:hidden"
                priority
                />
              </Link>
            <ul className="flex items-center gap-2.5">
              <li className="text-sm uppercase cursor-pointer">
                <Link href="/3d-models">3D Models</Link>
              </li>
              <li className="text-sm uppercase cursor-pointer">
                <Link href="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
