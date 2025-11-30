import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/cart-context";
import CartDrawer from "@/components/sections/cart-drawer";

export const metadata: Metadata = {
  title: "Kuviyal - Educational Toys for Children",
  description: "Discover Kuviyal: Your go-to for eco-friendly, educational toys! Ignite your child's imagination with our unique wooden and Montessori playthings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}