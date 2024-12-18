import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { headers } from 'next/headers';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb - The Complete Web3 Development Framework",
  description:
    "Build web3 apps, games, and more with our powerful suite of developer tools. Deploy smart contracts, integrate wallets, and create amazing user experiences.",
  metadataBase: new URL('https://thirdweb.com'),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#7857FF',
        },
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
          footerActionLink: 'text-purple-400 hover:text-purple-300',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}