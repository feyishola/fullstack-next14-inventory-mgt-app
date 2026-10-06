import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/components/ThemeToggle";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata = {
  title: { default: "Stockroom: inventory that tells you what to do next", template: "%s · Stockroom" },
  description: "Track stock, sales and expiry dates. Stockroom tells you what to reorder before you run out.",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the theme script may set data-theme before React hydrates
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
