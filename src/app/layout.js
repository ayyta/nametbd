import { Inter } from "next/font/google";
import "./globals.css";

// components
import Navbar from "./components/Navbar.jsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-screen h-screen`}>
        <div className="flex w-full h-full">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
