/* eslint-disable @next/next/no-img-element */
"use client";

import ItemCard from '@/components/wiki/ItemCard';
import { allItems } from '@/data/items';
import { Element, ItemCategory, BaseItem } from '@/types';
import { useMemo, useState, useCallback } from 'react';

type SortCriteria = 'name-asc' | 'name-desc' | 'element-asc' | 'element-desc';

export default function WikiPage() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [selectedElement, setSelectedElement] = useState<Element | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('name-asc');
  
  // Filter items based on selected category, element, and search query
  const filteredItems = useMemo(() => {
    let items = allItems.filter(item => {
      // Filter by category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      
      // Filter by element
      if (selectedElement !== 'All') {
        if (selectedElement === null) {
          // Filter for items with no element
          if (item.element !== null) {
            return false;
          }
        } else if (item.element !== selectedElement) {
          return false;
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query);
      }
      
      return true;
    });
    
    // Sort items based on sortCriteria
    items.sort((a: BaseItem, b: BaseItem) => {
      switch (sortCriteria) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'element-asc':
          // Handle null elements (consider them first or last based on preference)
          const elementA = a.element ?? 'ZZZ'; // Place null elements last
          const elementB = b.element ?? 'ZZZ';
          return elementA.localeCompare(elementB);
        case 'element-desc':
          const elementDescA = a.element ?? 'AAA'; // Place null elements first
          const elementDescB = b.element ?? 'AAA';
          return elementDescB.localeCompare(elementDescA);
        default:
          return 0;
      }
    });

    return items; // Return the sorted list
  }, [selectedCategory, selectedElement, searchQuery, sortCriteria]);
  
  // All available categories
  const categories: (ItemCategory | 'All')[] = [
    'All', 'Weapons', 'DemonicWeapons', 'LightSpells', 'HeavySpells', 'Relics', 'Fetishes', 'Rings'
  ];
  
  // All available elements
  const elements: (Element | 'All')[] = [
    'All', 'Fire', 'Water', 'Air', 'Earth', null
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Search and Filters */}
      <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-6 relative border border-[#818181]">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
        <div className="mb-3 sm:mb-6">
          <input
            type="text"
            placeholder="Search items..."
            className="text-gray-100 w-full px-3 py-2 bg-[#30303071] border border-[#818181] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ddaf7aa6] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-base sm:text-lg text-white font-medium mb-2 sm:mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {categories.map(category => (
                <button
                  key={category || 'none'}
                  className={`
                    px-2 sm:px-3 py-1 cursor-pointer rounded-md text-xs sm:text-sm
                    ${selectedCategory === category 
                      ? 'bg-[#ddaf7aa6] text-white' 
                      : 'bg-[#646464] text-white hover:bg-[#ddaf7aa6]'}
                  `}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'All' ? 'All Categories' : getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Element Filter */}
          <div>
            <h3 className="text-base sm:text-lg text-white font-medium mb-2 sm:mb-3">Filter by Element</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {elements.map(element => (
                <button
                  key={element || 'none'}
                  className={`
                    px-2 sm:px-3 py-1 cursor-pointer rounded-md text-xs sm:text-sm
                    ${selectedElement === element 
                      ? 'bg-[#ddaf7aa6] text-white' 
                      : 'bg-[#646464] text-white hover:bg-[#ddaf7aa6]'}
                  `}
                  onClick={() => setSelectedElement(element)}
                >
                  {element === 'All' ? 'All Elements' : element === null ? 'No Element' : element}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="text-sm text-white">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </div>
        
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-white font-medium hidden sm:block">Sort By:</label>
          <select
            id="sort"
            className="text-gray-100 px-2 py-1 text-sm bg-[#30303071] border border-[#818181] rounded-md focus:outline-none focus:ring-1 focus:ring-[#ddaf7aa6] focus:border-transparent"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value as SortCriteria)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="element-asc">Element (A-Z)</option>
            <option value="element-desc">Element (Z-A)</option>
          </select>
        </div>
      </div>
      
      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-6 relative border border-[#818181]">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
          <p className="text-white">No items found matching your filters.</p>
          <button
            className="px-3 py-1 mt-3 bg-[#646464] hover:bg-red-600 text-sm text-white rounded-md transition-colors"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedElement('All');
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to get display name for category
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'DemonicWeapons': return 'Demonic Weapons';
    case 'LightSpells': return 'Light Spells';
    case 'HeavySpells': return 'Heavy Spells';
    default: return category;
  }
}
