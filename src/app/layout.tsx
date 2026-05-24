import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import SaveUserToDB from "@/components/SaveUserToDB";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kjsce ED-Tech Student Learning Platform — Algorithm Design & Analysis",
  description:
    "A modern EdTech learning platform for college students studying Algorithm Design and Analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="dark">
        <body className={inter.className}>
          <SaveUserToDB />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
