"use client";

import { useState, useMemo } from 'react';
import { BaseItem, ItemCategory, Element } from '@/types';
import { allItems } from '@/data/items';
import ItemCard from '@/components/wiki/ItemCard';

export default function WikiPage() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [selectedElement, setSelectedElement] = useState<Element | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter items based on selected category, element, and search query
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
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
  }, [selectedCategory, selectedElement, searchQuery]);
  
  // All available categories
  const categories: (ItemCategory | 'All')[] = [
    'All', 'Weapons', 'DemonicWeapons', 'LightSpells', 'HeavySpells', 'Relics', 'Fetishes', 'Rings'
  ];
  
  // All available elements
  const elements: (Element | 'All')[] = [
    'All', 'Fire', 'Ice', 'Lightning', 'Decay', null
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Item Wiki</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Browse all game items with detailed information, filtering, and sorting options.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-[#1A1A1A] rounded-lg p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-medium mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category || 'none'}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    ${selectedCategory === category 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
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
            <h3 className="text-lg font-medium mb-3">Filter by Element</h3>
            <div className="flex flex-wrap gap-2">
              {elements.map(element => (
                <button
                  key={element || 'none'}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    ${selectedElement === element 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
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
      <div className="text-sm text-gray-400">
        Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
      </div>
      
      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">No items found matching your filters.</p>
          <button
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
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
