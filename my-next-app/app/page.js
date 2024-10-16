import ProductsList from "@/components/ProductList";
import Head from "next/head";

/**
 * Home component serves as the main entry point for the application.
 * It displays the homepage content, including the title, description,
 * and a list of products available in the store.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <Head>
        <title>Home - BuyIt!</title>
        <meta name="description" content="Discover our range of products tailored just for you." />
        <meta property="og:title" content="Home - Your Store Name" />
        <meta property="og:description" content="Discover our range of products tailored just for you." />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home - Your Store Name" />
        <meta name="twitter:description" content="Discover our range of products tailored just for you." />
      </Head>

      <h1 className="text-3xl font-bold my-8">Our Products</h1>
      <ProductsList />
    </main>
  );
}

// Dynamic Title and Description: The title and description are set to reflect the home page content.
// Open Graph Tags: Useful for social media sharing to provide context.
