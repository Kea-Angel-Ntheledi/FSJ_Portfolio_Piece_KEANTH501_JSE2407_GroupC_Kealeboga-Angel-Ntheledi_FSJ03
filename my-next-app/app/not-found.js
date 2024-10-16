import Link from 'next/link';

/**
 * NotFound component displays a message when a product is not found.
 *
 * @returns {JSX.Element} The rendered NotFound component.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="mb-4">We couldn't find the product you're looking for.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return to Products
      </Link>
    </div>
  );
}
