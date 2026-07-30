import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ironsoul.vercel.app'),
  title: "IronSoul Organisation | Empowering Youth Leadership",
  description: "IronSoul Organisation empowers students by nurturing confidence, resilience, and leadership qualities through motivational sessions and skill development programs.",
  keywords: ["IronSoul", "IronSoul Organisation", "Oggu Bhanu Sasitha", "Student Leadership", "Motivational Speaker", "Youth Empowerment", "JAM Sessions", "Skill Development"],
  openGraph: {
    title: "IronSoul Organisation",
    description: "Strength in Soul, Power in Action. Empowering youth leadership.",
    siteName: "IronSoul Organisation",
    images: [
      {
        url: "/assets/logo.jpg",
        width: 800,
        height: 600,
        alt: "IronSoul Logo",
      }
    ],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
