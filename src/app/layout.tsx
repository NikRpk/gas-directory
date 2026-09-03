import type { Metadata } from "next";
import "./globals.css";
import TopAppBar from "@/components/TopAppBar";

export const metadata: Metadata = {
  title: "gas.bolmso.app — Google Apps Script Directory",
  description:
    "A directory of Google Apps Script projects: explanations, install guides, GitHub links and screenshots.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Text:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TopAppBar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <footer className="border-t border-outline-variant bg-surface-container py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center text-sm text-on-surface-variant sm:flex-row sm:text-left">
            <p>gas.bolmso.app — a directory of Google Apps Script projects.</p>
            <p>
              Built with Google&nbsp;Material&nbsp;Design ·{" "}
              <a href="https://github.com/NikRpk" className="text-primary hover:underline">
                NikRpk
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
