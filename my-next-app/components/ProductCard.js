import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * ProductCard component displays product information and allows
 * users to navigate through product images.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.product - The product object containing product details.
 * @param {string} props.product.id - The unique identifier for the product.
 * @param {string} props.product.title - The title of the product.
 * @param {Array<string>} props.product.images - An array of image URLs for the product.
 * @param {number} props.product.price - The price of the product.
 * @param {string} props.product.category - The category of the product.
 * @param {number} props.product.rating - The average rating of the product.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
export default function ProductCard({ product }) {
  // State to manage the index of the currently displayed image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State to manage whether the image is still loading
  const [imageLoading, setImageLoading] = useState(true);

  // useEffect hook runs once the component is mounted to log product details
  useEffect(() => {
    console.log('ProductCard rendered for product:', product.id);
    console.log('Number of images:', product.images.length);
  }, [product]); // Dependency array ensures the effect runs when 'product' changes

  /**
   * Function to handle moving to the next image.
   * It updates the currentImageIndex state and triggers the image loading spinner.
   *
   * @param {Event} e - The event object from the button click.
   */
  const nextImage = (e) => {
    e.preventDefault(); // Prevents the default action of the button
    e.stopPropagation(); // Stops the event from bubbling up the DOM tree
    setImageLoading(true); // Sets the loading state to true before the next image loads
    // Moves to the next image index, looping back to 0 if at the last image
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  /**
   * Function to handle moving to the previous image.
   * It updates the currentImageIndex state and triggers the image loading spinner.
   *
   * @param {Event} e - The event object from the button click.
   */
  const prevImage = (e) => {
    e.preventDefault(); // Prevents the default action of the button
    e.stopPropagation(); // Stops the event from bubbling up the DOM tree
    setImageLoading(true); // Sets the loading state to true before the previous image loads
    // Moves to the previous image index, looping back to the last image if at the first
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md block w-full transition-transform hover:scale-105">
      {/* Image container for product images */}
      <div className="relative h-48">
        {/* Shows a spinner while the image is loading */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {/* Renders the current product image */}
        <Image
          src={product.images[currentImageIndex]} // Selects the current image based on the index
          alt={product.title} // Accessible alt text for the product image
          layout="fill" // Fills the parent container with the image
          objectFit="cover" // Ensures the image covers the container without distortion
          onLoadingComplete={() => setImageLoading(false)} // Removes the loading state when the image is fully loaded
        />
        {/* Conditionally renders the image navigation buttons and indicators if there are multiple images */}
        {product.images.length > 1 && (
          <>
            {/* Button to navigate to the previous image */}
            <button 
              onClick={prevImage} 
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center transition-colors text-xs"
            >
              &#8249; {/* Unicode for left arrow */}
            </button>
            {/* Button to navigate to the next image */}
            <button 
              onClick={nextImage} 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center transition-colors text-xs"
            >
              &#8250; {/* Unicode for right arrow */}
            </button>
            {/* Image indicators (dots) showing the current image being displayed */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product.images.map((_, index) => (
                <div 
                  key={index} // Unique key for each dot
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`} // Highlights the current image with a full white dot
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Product details section */}
      <div className="p-3">
        {/* Displays the product title */}
        <h2 className="text-sm font-semibold mb-1 truncate">{product.title}</h2>
        {/* Displays the product price formatted to 2 decimal places */}
        <p className="text-gray-600 text-sm mb-1">${product.price.toFixed(2)}</p>
        {/* Displays the product category */}
        <p className="text-xs text-gray-500 mb-1 truncate">{product.category}</p>
        {/* Displays the product rating with a star icon */}
        <div className="flex items-center text-xs mb-2">
          <span className="text-yellow-400 mr-1">★</span> {/* Star icon */}
          <span>{product.rating.toFixed(1)}</span> {/* Rating number formatted to 1 decimal place */}
        </div>
        {/* Link to the product details page */}
        <Link 
          href={`/products/${product.id}`} // Dynamic link to the product page using its id
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
