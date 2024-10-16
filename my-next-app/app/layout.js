import "./globals.css";
import Head from "next/head";
import Header from "../components/Header"; // Adjust the path as necessary

export const metadata = {
  title: "Your Store Name",
  description: "Explore a wide range of products tailored for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
      </Head>
      <body>
        <Header /> {/* Include the Header component */}
        <main className="container mx-auto">{children}</main> {/* Optional: Wrap children in a main container */}
      </body>
    </html>
  );
}
