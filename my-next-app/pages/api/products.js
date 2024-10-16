// pages/api/products.js

import { db } from '../../../firebase'; // Adjust this import based on your Firebase setup
import { collection, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';

export default async function handler(req, res) {
  const { search, category, sort, page = 1, limit = 20 } = req.query;

  try {
    // Fetch all products from Firestore
    const productsCollection = collection(db, 'products');
    const snapshot = await getDocs(productsCollection);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by category if provided
    let filteredProducts = products;
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Search using Fuse.js if a search term is provided
    if (search) {
      const fuse = new Fuse(filteredProducts, {
        keys: ['title'], // The keys in the product objects to search in
        threshold: 0.3,  // Adjust this value for more or less strict matching
      });
      const results = fuse.search(search);
      filteredProducts = results.map(result => result.item);
    }

    // Sort products if a sort option is provided
    if (sort === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Handle pagination
    const totalProducts = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    // Return paginated products and total count
    res.status(200).json({
      products: paginatedProducts,
      total: totalProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
}
