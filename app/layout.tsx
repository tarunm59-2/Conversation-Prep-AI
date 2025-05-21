import type { Metadata } from "next";
import { Mona_Sans  } from "next/font/google";
import "./globals.css"
import {Toast} from "next/dist/client/components/react-dev-overlay/ui/components/toast";
import {Toaster} from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conversation_Prepper",
  description: "Ai tool to prep for conversations , technical or not",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className = "dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
      <Toaster/>
      </body>
    </html>
  );
}
