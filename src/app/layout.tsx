import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { redirect } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  redirect('https://github.com/ryuuzera');
}
