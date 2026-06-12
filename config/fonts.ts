import { Fira_Code as FontMono, Inter as FontSans, Bungee as FontBungee } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontBungee = FontBungee({
  subsets: ["latin"],
  variable: "--font-bungee",
  weight:['400']
})
