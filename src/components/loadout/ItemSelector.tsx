"use client";

import { getItemsByCategory } from '@/data/items';
import { BaseItem, ItemCategory } from '@/types';
import { useState } from 'react';

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
          className="text-gray-100 w-full px-3 py-2 bg-[#30303071] border border-[#818181] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ddaf7aa6] focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredItems.map(item => {
        const isExcluded = excludedItems.includes(item.id);

        // Click behavior: toggle exclude if toggle is available, else select
        const handleClick = () => {
          if (onItemExcludeToggle) {
            onItemExcludeToggle(item.id);
          } else {
            onItemSelect(item);
          }
        };

        return (
          <div 
            key={item.id}
            onClick={handleClick}
            className={`
              relative flex flex-col items-center 
              p-2 rounded-md cursor-pointer
              ${isExcluded 
                ? 'opacity-50 bg-[#30303025] hover:border-[#ddaf7aa6]' 
                : 'bg-[#303030] border-[#818181] hover:border-[#ddaf7aa6]'
              } 
              hover:bg-[#474747]
              border-1 transition-colors
            `}            
          >
            <div className="w-16 h-16 mb-2 bg-[#e2e2e2] rounded-md flex items-center justify-center">
              {/* Placeholder for the actual image */}
              <span className="text-2xl text-black">{item.name.charAt(0)}</span>
            </div>

            <span className="text-xs text-center text-gray-100 truncate w-full">{item.name}</span>

            {item.element && (
              <div 
                className="absolute top-1 right-1 w-3 h-3 rounded-full" 
                style={{ backgroundColor: getElementColor(item.element) }}
              />
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
