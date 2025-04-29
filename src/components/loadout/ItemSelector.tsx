"use client";

import { useState } from 'react';
import { BaseItem, ItemCategory } from '@/types';
import { getItemsByCategory } from '@/data/items';

interface ItemSelectorProps {
  category: ItemCategory;
  onItemSelect: (item: BaseItem) => void;
  excludedItems?: string[];
  onItemExcludeToggle?: (itemId: string) => void;
}

const ItemSelector = ({ 
  category, 
  onItemSelect, 
  excludedItems = [], 
  onItemExcludeToggle 
}: ItemSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get items for the selected category
  const items = getItemsByCategory(category);
  
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredItems.map(item => {
          const isExcluded = excludedItems.includes(item.id);
          
          return (
            <div 
              key={item.id}
              className={`
                relative flex flex-col items-center 
                p-2 rounded-md cursor-pointer 
                ${isExcluded ? 'opacity-50 bg-gray-900' : 'bg-gray-800'} 
                hover:bg-gray-700 transition-colors
              `}
            >
              <div 
                className="w-16 h-16 mb-2 bg-gray-700 rounded-md flex items-center justify-center"
                onClick={() => onItemSelect(item)}
              >
                {/* Placeholder for the actual image - in a real app you'd use the item.iconUrl */}
                <span className="text-2xl">{item.name.charAt(0)}</span>
              </div>
              
              <span className="text-xs text-center text-gray-300 truncate w-full">{item.name}</span>
              
              {item.element && (
                <div 
                  className="absolute top-1 right-1 w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getElementColor(item.element) }}
                />
              )}
              
              {onItemExcludeToggle && (
                <button
                  className={`
                    absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs
                    ${isExcluded ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}
                    hover:bg-red-600 transition-colors
                  `}
                  onClick={() => onItemExcludeToggle(item.id)}
                  title={isExcluded ? 'Include item' : 'Exclude item'}
                >
                  {isExcluded ? '✕' : '–'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get color for element
const getElementColor = (element: string | null): string => {
  if (!element) return '#cccccc';
  
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Ice': return '#4da6ff';
    case 'Lightning': return '#ffcc00';
    case 'Decay': return '#66cc66';
    default: return '#cccccc';
  }
};

export default ItemSelector;
