"use client"; // Marks this component as a client-side component

import { useParams, useRouter } from "next/navigation"; // Next.js hooks
import { useState, useEffect } from "react"; // React hooks for state management
import Image from "next/image"; // Optimized Image component
import { db } from "../../../pages/api/firebase"; // Import Firebase setup
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const API_URL = "https://next-ecommerce-api.vercel.app/products";

export default function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL params
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [dateSortOption, setDateSortOption] = useState("");
  const [ratingSortOption, setRatingSortOption] = useState("");

  // New review form state
  const [newReview, setNewReview] = useState({
    email: "",
    rating: 0,
    comment: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit new review to Firebase
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newReviewWithDate = {
      ...newReview,
      date: new Date().toISOString(),
      rating: parseFloat(newReview.rating),
    };

    try {
      await addDoc(collection(db, "reviews"), {
        ...newReviewWithDate,
        productId: id,
      });
      setReviews([newReviewWithDate, ...reviews]);
      setNewReview({ email: "", rating: 0, comment: "" });
    } catch (err) {
      console.error("Error adding review: ", err);
    }
  };

  // Fetch product details from the API and combine reviews from the product and Firebase
  const fetchProductAndReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);

      const productReviews = data.reviews || [];

      const firebaseReviews = await fetchReviews(id); // Fetch reviews from Firebase
      const combinedReviews = [...productReviews, ...firebaseReviews]; // Combine both reviews
      setReviews(combinedReviews);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch reviews for the product from Firebase
  const fetchReviews = async (productId) => {
    const q = query(collection(db, "reviews"), where("productId", "==", productId));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedReviews = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ ...doc.data(), id: doc.id });
      });
      return fetchedReviews;
    } catch (err) {
      console.error("Error fetching reviews: ", err);
      return [];
    }
  };

  // Sort reviews based on selected options
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
    if (!id) return;
    fetchProductAndReviews();
  }, [id]);

  useEffect(() => {
    sortReviews();
  }, [dateSortOption, ratingSortOption]);

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center">Loading product...</p>;

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
      <button onClick={() => router.back()} className="bg-gray-300 text-black px-4 py-2 rounded mb-4">
        Back
      </button>

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
              <button onClick={prevImage} className="bg-gray-300 text-black px-4 py-2 rounded">
                Previous
              </button>
              <button onClick={nextImage} className="bg-gray-300 text-black px-4 py-2 rounded">
                Next
              </button>
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
        <h3 className="text-2xl font-semibold mb-4">Add a Review</h3>
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              name="email"
              value={newReview.email}
              onChange={handleInputChange}
              placeholder="Your email"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              placeholder="Rating (0-5)"
              className="p-2 border rounded"
              min="0"
              max="5"
              step="0.1"
              required
            />
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Write your review"
              className="p-2 border rounded"
              required
            ></textarea>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </div>
        </form>

        <div className="flex justify-between mb-4">
          <select onChange={(e) => setDateSortOption(e.target.value)} className="border p-2">
            <option value="">Sort by Date</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select onChange={(e) => setRatingSortOption(e.target.value)} className="border p-2">
            <option value="">Sort by Rating</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to add a review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="p-4 border-b">
              <p className="text-sm text-gray-500">{review.email} - {new Date(review.date).toLocaleString()}</p>
              <p className="text-yellow-500">Rating: {review.rating}</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
