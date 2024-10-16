"use client"; // Marks this component as a client-side component, necessary for using hooks like useState, useEffect

import { useParams, useRouter } from "next/navigation"; // Next.js hooks for routing and accessing URL params
import { useState, useEffect } from "react"; // React hooks for managing component state and lifecycle
import Image from "next/image"; // Next.js optimized Image component for handling images
import { db } from "@/pages/api/firebase"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore"; // Firestore methods for fetching documents

export default function ProductDetail() {
  const { id } = useParams(); // Extract 'id' parameter from the URL
  const router = useRouter(); // Get Next.js router to navigate programmatically
  
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

    const newReviewWithDate = {
      ...newReview,
      date: new Date().toISOString(),
      rating: parseFloat(newReview.rating)
    };

    setReviews([newReviewWithDate, ...reviews]);
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
    
    const updatedReview = { ...editReview, date: new Date().toISOString() };
    const updatedReviews = [...reviews];
    updatedReviews[editReviewIndex] = updatedReview;

    setReviews(updatedReviews);
    setEditReviewIndex(null);
    setEditReview({ user: "", rating: 0, comment: "" });
  };

  // Handler for deleting a review
  const handleDeleteReview = (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
  };

  // Fetch the product data and reviews from Firestore when the component is mounted or 'id' changes
  useEffect(() => {
    if (!id) return; // If no ID is present, exit early

    const fetchProduct = async () => {
      try {
        // Firestore document reference
        const docRef = doc(db, "products", id);
        // Fetch product document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data); // Set the product data
          setReviews(data.reviews || []); // Set the reviews (if any)
          setError(null); // Clear any previous errors
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct(); // Trigger the fetch function
  }, [id]); // Only re-run when 'id' changes

  const sortReviews = () => {
    let sortedReviews = [...reviews];

    if (dateSortOption === "newest") {
      sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (dateSortOption === "oldest") {
      sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (ratingSortOption === "rating-high") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (ratingSortOption === "rating-low") {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    }

    setReviews(sortedReviews);
  };

  useEffect(() => {
    sortReviews();
  }, [dateSortOption, ratingSortOption]);

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center">No product found.</p>;

  const images = product.images || [];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="bg-gray-300 text-black px-4 py-2 rounded mb-4">Back</button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative h-96">
          {currentImage && (
            <Image
              src={currentImage}
              alt={product.title}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg border-4 border-gray-300"
            />
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button onClick={prevImage} className="bg-gray-300 text-black px-4 py-2 rounded">Previous</button>
              <button onClick={nextImage} className="bg-gray-300 text-black px-4 py-2 rounded">Next</button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-lg font-semibold mb-6">Price: ${product.price}</p>
            <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
            <p className="text-sm text-gray-600">Tags: {product.tags.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

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
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Review</button>
        </form>

        <div className="flex justify-between mb-4">
          <div>
            <label className="mr-2">Sort by Date:</label>
            <select value={dateSortOption} onChange={(e) => setDateSortOption(e.target.value)} className="p-2 border border-gray-300 rounded">
              <option value="">None</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Sort by Rating:</label>
            <select value={ratingSortOption} onChange={(e) => setRatingSortOption(e.target.value)} className="p-2 border border-gray-300 rounded">
              <option value="">None</option>
              <option value="rating-high">Highest First</option>
              <option value="rating-low">Lowest First</option>
            </select>
          </div>
        </div>

        {reviews.length === 0 && <p className="text-gray-600">No reviews yet. Be the first to write a review!</p>}
        {reviews.map((review, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{review.user}</p>
                <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditReviewIndex(index); setEditReview(review); }} className="text-blue-500">Edit</button>
                <button onClick={() => handleDeleteReview(index)} className="text-red-500">Delete</button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Rating: {review.rating}/5</p>
            <p>{review.comment}</p>

            {editReviewIndex === index && (
              <form onSubmit={handleEditReviewSubmit} className="mt-4">
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
                  />
                </div>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save Changes</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
