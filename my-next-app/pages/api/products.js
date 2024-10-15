import { db } from '@/firebase'; // Import the Firestore database instance from Firebase configuration

// The default export is an asynchronous API route handler in Next.js
export default async function handler(req, res) {
  try {
    // Destructure the query parameters from the request, setting default values for pagination (page=1, limit=20)
    const { search, category, sort, page = 1, limit = 20 } = req.query;

    // Initialize a query reference to the 'products' collection in Firestore
    let productsQuery = db.collection('products'); // Adjust this if your Firebase structure is different

    // Search by title (if 'search' is provided in the query)
    // Firebase allows for range queries, so we use '>= search' and '<= search + \uf8ff' to find products
    // whose titles start with the search term. '\uf8ff' is the last character in Unicode, ensuring the search is inclusive.
    if (search) {
      productsQuery = productsQuery.where('title', '>=', search).where('title', '<=', search + '\uf8ff');
    }

    // Filter by category (if 'category' is provided in the query)
    // The '==' operator filters products where the 'category' field matches exactly with the query parameter.
    if (category) {
      productsQuery = productsQuery.where('category', '==', category);
    }

    // Sort by price (if 'sort' is provided in the query)
    // The 'sort' parameter is expected in the format 'price_asc' or 'price_desc'.
    // We split the 'sort' string into 'sortField' (e.g., 'price') and 'sortDirection' (either 'asc' or 'desc').
    // We then use Firestore's 'orderBy' to sort the results by price in ascending or descending order.
    if (sort) {
      const [sortField, sortDirection] = sort.split('_'); // Split the sort parameter by the underscore
      if (sortField === 'price') {
        productsQuery = productsQuery.orderBy('price', sortDirection === 'asc' ? 'asc' : 'desc'); // Apply sorting
      }
    }

    // Pagination logic
    // Firestore's 'offset' and 'limit' methods are used to paginate results.
    // 'offset' skips the first (page - 1) * limit documents, while 'limit' restricts the number of returned documents.
    const productsSnapshot = await productsQuery
      .offset((page - 1) * limit) // Calculate how many documents to skip based on the current page and limit
      .limit(limit)               // Limit the result set to the specified 'limit' (default is 20)
      .get();                     // Execute the query and retrieve the documents from Firestore

    // Map over the documents retrieved from Firestore to structure the product data
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,       // Extract the document ID (which acts as the product ID)
      ...doc.data(),    // Spread the rest of the document data (e.g., title, price, category, etc.)
    }));

    // Send a successful response with the products array as JSON
    res.status(200).json({ products });
  } catch (error) {
    // Catch any errors during the Firestore query or other operations and return a 500 error response
    res.status(500).json({ error: 'Error fetching products' });
  }
}
