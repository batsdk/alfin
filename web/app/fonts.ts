import { Geist, Geist_Mono } from "next/font/google";

// Shared by the root layout and global-error, which renders its own <html>
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
