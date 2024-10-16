"use client";

import { useState } from 'react';

/**
 * ReviewsList component displays a list of customer reviews and allows sorting by date or rating.
 * It also provides a form for users to submit their own reviews.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.reviews - An array of review objects to be displayed.
 * @param {string} props.reviews[].name - The name of the reviewer.
 * @param {string} props.reviews[].date - The date of the review in ISO format.
 * @param {number} props.reviews[].rating - The rating given by the reviewer (0 to 5).
 * @param {string} props.reviews[].comment - The review comment.
 * @returns {JSX.Element} The rendered ReviewsList component.
 */
export default function ReviewsList({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [sortBy, setSortBy] = useState('date');
  const [showReviewForm, setShowReviewForm] = useState(false); // Toggle for showing the review form
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    comment: '',
  });

  /**
   * Handles sorting of reviews based on the selected type (date or rating).
   *
   * @param {string} type - The type to sort by ('date' or 'rating').
   */
  const handleSort = (type) => {
    setSortBy(type);
    const sortedReviews = [...reviews].sort((a, b) => {
      if (type === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else {
        return b.rating - a.rating;
      }
    });
    setReviews(sortedReviews);
  };

  /**
   * Handles form input changes for the new review.
   *
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  /**
   * Handles submission of a new review.
   *
   * @param {Object} e - The event object.
   */
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReviewWithDate = {
      ...newReview,
      date: new Date().toISOString(),
      rating: parseFloat(newReview.rating),
    };
    setReviews([newReviewWithDate, ...reviews]); // Add new review to the top
    setNewReview({ name: '', rating: 0, comment: '' }); // Clear form
    setShowReviewForm(false); // Hide the form after submission
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div>
          <button
            onClick={() => handleSort('date')}
            className={`mr-2 px-3 py-1 rounded ${
              sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Sort by Date
          </button>
          <button
            onClick={() => handleSort('rating')}
            className={`px-3 py-1 rounded ${
              sortBy === 'rating' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Sort by Rating
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowReviewForm(!showReviewForm)} // Toggle form visibility
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Write a Review
      </button>

      {/* Review form */}
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-100 rounded-md">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating (0 to 5)</label>
            <input
              type="number"
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.map((review, index) => (
        <div key={index} className="border-b pb-4 mb-4 last:border-b-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{review.name}</h3>
            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{review.rating.toFixed(1)}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
