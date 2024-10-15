"use client"; // Marks this component as a client-side component, necessary for using hooks like useState, useEffect

import { useParams, useRouter } from "next/navigation"; // Next.js hooks for routing and accessing URL params
import { useState, useEffect } from "react"; // React hooks for managing component state and lifecycle
import Image from "next/image"; // Next.js optimized Image component for handling images

// API URL for fetching product details
const API_URL = "https://next-ecommerce-api.vercel.app/products";

export default function ProductDetail() {
  // Extract 'id' parameter from the URL
  const { id } = useParams();
  // Get Next.js router to navigate programmatically
  const router = useRouter();
  
  // State to hold the product data
  const [product, setProduct] = useState(null);
  // State to handle any errors during data fetching
  const [error, setError] = useState(null);
  // State to track the currently displayed image index for the product
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State to hold product reviews
  const [reviews, setReviews] = useState([]);
  // State to manage the selected option for sorting reviews by date
  const [dateSortOption, setDateSortOption] = useState("");
  // State to manage the selected option for sorting reviews by rating
  const [ratingSortOption, setRatingSortOption] = useState("");

  // State for the new review form, holding user, rating, and comment values
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 0,
    comment: ""
  });

  // State for tracking the index of the review being edited
  const [editReviewIndex, setEditReviewIndex] = useState(null);
  // State to hold the values of the review currently being edited
  const [editReview, setEditReview] = useState({
    user: "",
    rating: 0,
    comment: ""
  });

  // Handler to update new review form inputs when user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Handler for submitting a new review
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    // Create a new review object with the current date
    const newReviewWithDate = {
      ...newReview,
      date: new Date().toISOString(), // Add current date to the review
      rating: parseFloat(newReview.rating) // Ensure rating is stored as a float
    };

    // Add the new review to the top of the reviews array
    setReviews([newReviewWithDate, ...reviews]);
    // Clear the form after submission
    setNewReview({ user: "", rating: 0, comment: "" });
  };

  // Handler for updating the edit review form when user types
  const handleEditReviewChange = (e) => {
    const { name, value } = e.target;
    setEditReview({ ...editReview, [name]: value });
  };

  // Handler for submitting an edited review
  const handleEditReviewSubmit = (e) => {
    e.preventDefault();
    
    // Update the edited review object with the current date
    const updatedReview = { ...editReview, date: new Date().toISOString() };
    
    // Create a copy of the reviews array and update the selected review
    const updatedReviews = [...reviews];
    updatedReviews[editReviewIndex] = updatedReview;

    // Update the reviews state and reset edit form state
    setReviews(updatedReviews);
    setEditReviewIndex(null); // Exit edit mode
    setEditReview({ user: "", rating: 0, comment: "" }); // Clear form
  };

  // Handler for deleting a review
  const handleDeleteReview = (index) => {
    // Remove the selected review by filtering it out of the array
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
  };

  // Fetch the product data and reviews when the component is mounted or 'id' changes
  useEffect(() => {
    if (!id) return; // If no ID is present, exit early

    const fetchProduct = async () => {
      try {
        // Fetch the product data by its ID
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data); // Set the product data
        setReviews(data.reviews || []); // Set the reviews (if any)
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message); // Handle any errors during fetch
      }
    };

    fetchProduct(); // Trigger the fetch function
  }, [id]); // Only re-run when 'id' changes

  // Function to sort reviews based on selected date and rating options
  const sortReviews = () => {
    let sortedReviews = [...reviews]; // Copy the reviews array for sorting

    // Sort reviews by date
    if (dateSortOption === "newest") {
      sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    } else if (dateSortOption === "oldest") {
      sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first
    }

    // Sort reviews by rating
    if (ratingSortOption === "rating-high") {
      sortedReviews.sort((a, b) => b.rating - a.rating); // Highest rating first
    } else if (ratingSortOption === "rating-low") {
      sortedReviews.sort((a, b) => a.rating - b.rating); // Lowest rating first
    }

    setReviews(sortedReviews); // Update the sorted reviews in state
  };

  // Re-sort reviews when the sort options change
  useEffect(() => {
    sortReviews();
  }, [dateSortOption, ratingSortOption]); // Trigger on changes to sort options

  // Display an error message if an error occurred during fetch
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  // If no product is found, show a message
  if (!product) return <p className="text-center">No product found.</p>;

  // Retrieve product images or set an empty array if no images
  const images = product.images || [];
  // Get the current image based on the currentImageIndex state
  const currentImage = images[currentImageIndex];

  // Handler for displaying the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Wrap around to the start if at the last image
  };

  // Handler for displaying the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Wrap around to the end if at the first image
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back button to navigate to the previous page */}
      <button
        onClick={() => router.back()}
        className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
      >
        Back
      </button>

      {/* Product details section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative h-96">
          {/* Display the current image if available */}
          {currentImage && (
            <Image
              src={currentImage}
              alt={product.title}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg border-4 border-gray-300"
            />
          )}
          {/* Display next/previous buttons if more than one image */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={prevImage}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Previous
              </button>
              <button
                onClick={nextImage}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.title}</h2> {/* Product title */}
            <p className="text-gray-700 mb-6">{product.description}</p> {/* Product description */}
            <p className="text-lg font-semibold mb-6">Price: ${product.price}</p> {/* Product price */}
            <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p> {/* Product category */}
            <p className="text-sm text-gray-600">Tags: {product.tags.join(", ")}</p> {/* Product tags */}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

        {/* Form for submitting a new review */}
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold mb-1">User</label>
            <input
              type="text"
              name="user"
              value={newReview.user}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              min="1"
              max="5"
              step="0.1"
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold mb-1">Comment</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              required
              className="p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>

        {/* Review sorting options */}
        <div className="flex justify-between mb-4">
          <div>
            <label className="text-sm font-semibold mr-2">Sort by Date:</label>
            <select
              value={dateSortOption}
              onChange={(e) => setDateSortOption(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">None</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mr-2">Sort by Rating:</label>
            <select
              value={ratingSortOption}
              onChange={(e) => setRatingSortOption(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">None</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Display reviews */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-6 border p-4 rounded">
              <p className="text-sm font-semibold mb-1">User: {review.user}</p>
              <p className="text-sm font-semibold mb-1">Rating: {review.rating}</p>
              <p className="text-sm text-gray-600 mb-1">Date: {new Date(review.date).toLocaleString()}</p>
              <p className="mb-4">{review.comment}</p>

              {/* Review editing section */}
              {editReviewIndex === index ? (
                <form onSubmit={handleEditReviewSubmit}>
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">User</label>
                    <input
                      type="text"
                      name="user"
                      value={editReview.user}
                      onChange={handleEditReviewChange}
                      required
                      className="p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={editReview.rating}
                      onChange={handleEditReviewChange}
                      min="1"
                      max="5"
                      step="0.1"
                      required
                      className="p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-semibold mb-1">Comment</label>
                    <textarea
                      name="comment"
                      value={editReview.comment}
                      onChange={handleEditReviewChange}
                      required
                      className="p-2 border border-gray-300 rounded"
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save Review
                  </button>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditReviewIndex(index); // Set the index of the review being edited
                      setEditReview(review); // Fill the form with the existing review data
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
