'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import SearchFilterSort from './SearchFilterSort';

import { db } from '../pages/api/firebase'; // Import Firestore from the centralized file
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

const PRODUCTS_PER_PAGE = 20;

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  async function fetchCategories() {
    try {
      const categoriesRef = collection(db, 'categories');
      const docSnapshot = await getDocs(categoriesRef);
      const categoriesData = docSnapshot.docs.map(doc => doc.data());

      if (categoriesData.length > 0) {
        setCategories(categoriesData[0].categories);
      }
    } catch (err) {
      console.error('Error fetching categories from Firestore:', err);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const sort = searchParams.get('sort') || '';
      const page = parseInt(searchParams.get('page') || '1', 10);
      const productsRef = collection(db, 'products');

      let q = query(productsRef, limit(PRODUCTS_PER_PAGE));

      if (search) {
        q = query(productsRef, where('name', '>=', search), where('name', '<=', search + '\uf8ff'));
      }

      if (category) {
        q = query(productsRef, where('category', '==', category));
      }

      if (sort) {
        const [field, order] = sort.split('_');
        q = query(productsRef, orderBy(field, order === 'asc' ? 'asc' : 'desc'));
      }

      if (lastVisible && page > 1) {
        q = query(productsRef, startAfter(lastVisible), limit(PRODUCTS_PER_PAGE));
      }

      const productSnapshot = await getDocs(q);
      const productsData = productSnapshot.docs.map(doc => doc.data());

      setProducts(productsData);
      setLastVisible(productSnapshot.docs[productSnapshot.docs.length - 1]);
    } catch (err) {
      console.error('Error fetching products from Firestore:', err);
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push('?' + params.toString());
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <SearchFilterSort categories={categories} onReset={fetchProducts} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">No products found.</div>
        )}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button 
          onClick={() => handlePageChange(parseInt(searchParams.get('page') || '1', 10) - 1)} 
          disabled={parseInt(searchParams.get('page') || '1', 10) === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous Page
        </button>
        <span>Page {searchParams.get('page') || 1}</span>
        <button 
          onClick={() => handlePageChange(parseInt(searchParams.get('page') || '1', 10) + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
