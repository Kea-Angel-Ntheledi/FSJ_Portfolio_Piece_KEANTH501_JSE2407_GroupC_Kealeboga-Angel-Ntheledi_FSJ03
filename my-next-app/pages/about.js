import Link from 'next/link';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Our Store</h1>
      <p className="mb-4">
        Welcome to Your Store Name! We offer a wide range of products tailored just for you. Our mission is to provide high-quality items at competitive prices, ensuring customer satisfaction every step of the way.
      </p>
      <p className="mb-4">
        Our store is located at:
        <br />
        123 Store Address,
        <br />
        CapeTown, SA, 2459.
      </p>
      <p className="mb-4">
        We are committed to delivering the best shopping experience and are always here to help with any questions or concerns.
      </p>
      <Link href="/">
        <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
          &larr; Back to Products
        </button>
      </Link>
    </div>
  );
}
