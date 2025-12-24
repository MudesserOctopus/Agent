import Navbar from "../app/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "AI Agent Platform",
  description: "Build and deploy AI agents faster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="app-content">
          {children}
        </main>
      </body>
    </html>
  );
}
