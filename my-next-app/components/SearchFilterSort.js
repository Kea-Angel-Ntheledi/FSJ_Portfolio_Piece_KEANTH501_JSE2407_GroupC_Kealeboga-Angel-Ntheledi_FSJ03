'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchFilterSort({ categories, onReset }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Restore filters from searchParams on component load
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';

    setSearchTerm(search);
    setSelectedCategory(category);
    setSelectedSort(sort);
  }, [searchParams]);

  // Apply the filters and update the URL with the query parameters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (selectedSort) {
      params.set('sort', selectedSort);
    }
    router.push('?' + params.toString()); // Keep filters in URL
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    applyFilters();
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    applyFilters();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSort('');
    router.push('/'); // Reset filters by navigating to the base route
    if (onReset) onReset();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
      {/* Search */}
      <div className="w-full md:w-2/5">
        <label htmlFor="search" className="sr-only">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-1/5">
        <label htmlFor="category" className="sr-only">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="w-full md:w-1/5">
        <label htmlFor="sort" className="sr-only">Sort</label>
        <select
          id="sort"
          value={selectedSort}
          onChange={handleSortChange}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full md:w-auto p-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Reset
      </button>
    </div>
  );
}
