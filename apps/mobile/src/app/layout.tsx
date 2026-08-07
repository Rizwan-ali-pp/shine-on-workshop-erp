import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShineTrack ERP",
  description: "Workshop Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body>
  <QueryProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </QueryProvider>
</body>
    </html>
  );
}
