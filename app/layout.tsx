import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { FamilyProvider } from "./contexts/FamilyContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import TopNavbar from "./components/ui/TopNavbar";
import Footer from "./components/ui/Footer";
import AuthGate from "./components/AuthGate";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family Tree App",
  description: "Interactive family tree visualization with modern UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only sync <html> to the theme (light/dark)
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var theme = localStorage.getItem('theme');
                var html = document.documentElement;
                if (theme === 'dark' || theme === 'light') {
                  html.classList.remove('dark', 'light');
                  html.classList.add(theme);
                }
              } catch(e){}
            })();
          `,
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}>
        <AuthProvider>
          <NotificationProvider>
            <SettingsProvider>
              <FamilyProvider>
                <AuthGate>
                  <TopNavbar />
                  <div className="pt-14 min-h-screen flex flex-col">
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                </AuthGate>
              </FamilyProvider>
            </SettingsProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
