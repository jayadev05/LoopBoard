import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

import "../styles/globals.css";
import { QueryProvider } from "@/components/provider/QueryProvider";
import AuthProvider from "@/components/provider/AuthProvider";


const inter = Inter({
  subsets:["latin"]
});

export const metadata: Metadata = {
  title: "LoopBoard",
  description: "keep your teams in the loop effortlessly.",
  icons:'/logo.svg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
      <body
        className={cn(inter.className,'antialiased min-h-screen')}
      >
        <QueryProvider>
         {children}
        </QueryProvider>
       
      </body>
    </html>
    </AuthProvider>
    
  );
}
