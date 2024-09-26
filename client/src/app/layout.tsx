import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import ScrollButtons from "@/components/ScrollButtons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PK DigMark - Your Premier Marketplace for Digital Assets",
  description:
    "Welcome to PK DigMark, your premier digital assets marketplace for buying and selling a diverse range of digital products. Explore our extensive collection of software, eBooks, music, digital art, stock photos, videos, 3D models, graphics, templates, fonts, plugins, animations, web design elements, virtual reality experiences, and gaming assets. PK DigMark provides a secure and user-friendly platform for creators and buyers alike, empowering you to monetize your digital content and discover unique digital goods. Whether you're a graphic designer, musician, author, or developer, PK DigMark is the ultimate destination for all your digital asset needs. Join us today to unlock the full potential of digital commerce and elevate your online presence with high-quality digital products tailored to your creative projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SearchProvider>
            <Navbar />
            <ScrollButtons />
            {children}
            <Footer />
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
