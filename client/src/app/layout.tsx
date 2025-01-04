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
  manifest: "/manifest.json",
  metadataBase: new URL("https://digmark.pankri.com"),

  title: "PK DigMark - Your Premier Marketplace for Digital Assets",
  description:
    "Welcome to PK DigMark, your premier digital assets marketplace for buying and selling a diverse range of digital products. Explore our extensive collection of software, eBooks, music, digital art, stock photos, videos, 3D models, graphics, templates, fonts, plugins, animations, web design elements, virtual reality experiences, and gaming assets. PK DigMark provides a secure and user-friendly platform for creators and buyers alike, empowering you to monetize your digital content and discover unique digital goods. Whether you're a graphic designer, musician, author, or developer, PK DigMark is the ultimate destination for all your digital asset needs. Join us today to unlock the full potential of digital commerce and elevate your online presence with high-quality digital products tailored to your creative projects.",

  // Keywords
  keywords: [
    "digital assets marketplace",
    "PK DigMark",
    "DigMark",
    "buy digital products",
    "sell digital products",
    "software",
    "eBooks",
    "music",
    "digital art",
    "stock photos",
    "videos",
    "3D models",
    "graphics",
    "templates",
    "fonts",
    "plugins",
    "animations",
    "web design",
    "virtual reality",
    "gaming assets",
    "digital content",
    "creative projects",
  ],

  // Open Graph
  openGraph: {
    title: "PK DigMark - Your Premier Marketplace for Digital Assets",
    description:
      "Discover a diverse range of digital products on PK DigMark. Buy and sell software, eBooks, music, digital art, and more on a secure, user-friendly platform.",
    url: "https://digmark.pankri.com",
    type: "website",
    images: [
      {
        url: "/digmark.png",
        width: 1200,
        height: 630,
        alt: "PK DigMark Digital Assets Marketplace",
      },
    ],
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "PK DigMark - Your Premier Marketplace for Digital Assets",
    description:
      "Explore PK DigMark's marketplace for digital assets, featuring software, eBooks, music, stock photos, and more. Buy and sell digital products securely.",
    images: ["/digmark.png"],
    site: "PK DigMark",
  },
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
