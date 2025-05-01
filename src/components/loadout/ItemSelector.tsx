"use client";

import { getItemsByCategory } from '@/data/items';
import { BaseItem, ItemCategory } from '@/types';
import { useState, useRef, useEffect } from 'react';
import ItemCardPopup from '../common/ItemCardPopup';

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
  const [hoveredItem, setHoveredItem] = useState<BaseItem | null>(null);
  const [popupPosition, setPopupPosition] = useState<{top: number, left: number} | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Detect if device is a touch device (mobile or tablet)
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for touch capability
      const hasTouchCapability = 'ontouchstart' in window || 
                               navigator.maxTouchPoints > 0 || 
                               (navigator as any).msMaxTouchPoints > 0;
      
      // Use a higher breakpoint (1024px) to include tablets in landscape mode
      const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
      
      // Check for tablet-specific dimensions (both portrait and landscape)
      const isTabletSize = (window.innerWidth >= 600 && window.innerWidth <= 1200) || 
                          (window.innerHeight >= 600 && window.innerHeight <= 1200);
      
      // Consider it a touch device if it has touch capability AND (small screen OR tablet dimensions)
      setIsTouchDevice(hasTouchCapability && (isSmallScreen || isTabletSize));
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);
  
  // Handle touch events on touch devices (mobile/tablet)
  useEffect(() => {
    if (isTouchDevice && hoveredItem) {
      // For touch devices, any touch anywhere should close the popup
      const handleTouchAnywhere = () => {
        // Add a small delay to allow the touch to register properly
        setTimeout(() => {
          setHoveredItem(null);
          setPopupPosition(null);
        }, 10);
      };
      
      // Add the event listener to the document
      document.addEventListener('touchstart', handleTouchAnywhere);
      
      // Clean up the event listener when component unmounts or popup closes
      return () => {
        document.removeEventListener('touchstart', handleTouchAnywhere);
      };
    }
  }, [isTouchDevice, hoveredItem]);
  
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
        {hoveredItem && popupPosition && (
          <div 
            className="fixed z-50" 
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`
            }}
          >
            <ItemCardPopup item={hoveredItem} />
          </div>
        )}
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
            onMouseEnter={(e) => {
              if (!isTouchDevice) {
                setHoveredItem(item);
                const rect = e.currentTarget.getBoundingClientRect();
                
                // Calculate optimal position for the popup
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
              
              // Estimate popup dimensions
              const popupWidth = 288; // 72 * 4 = 288px (w-72 in tailwind)
              const popupHeight = 500; // Increased height estimate to prevent cut-off
              
              // Default position (to the right)
              let top = rect.top;
              let left = rect.right + 10;
              
              // Check if popup would go off the right edge of the screen
              if (left + popupWidth > viewportWidth) {
                // Try left placement
                left = rect.left - popupWidth - 10;
                
                // If left placement doesn't work, try centering horizontally
                if (left < 0) {
                  left = Math.max(10, (viewportWidth - popupWidth) / 2);
                }
              }
              
              // Check if popup would go off the bottom of the screen
              if (top + popupHeight > viewportHeight) {
                // Adjust top position to keep popup within viewport
                top = Math.max(10, viewportHeight - popupHeight - 10);
              }
              
              setPopupPosition({ top, left });
              }
            }}
            onMouseLeave={() => {
              if (!isTouchDevice) {
                setHoveredItem(null);
                setPopupPosition(null);
              }
            }}
            onTouchStart={(e) => {
              if (isTouchDevice) {
                const element = e.currentTarget;
                const timer = setTimeout(() => {
                  setHoveredItem(item);
                  const rect = element.getBoundingClientRect();
                  
                  // Calculate optimal position for the popup
                  const viewportWidth = window.innerWidth;
                  const viewportHeight = window.innerHeight;
                  
                  // For mobile, prefer centering the popup
                  let top = Math.max(10, rect.top - 100); // Position above the finger
                  let left = Math.max(10, (viewportWidth - 288) / 2); // Center horizontally
                  
                  // Ensure it doesn't go off bottom
                  if (top + 500 > viewportHeight) {
                    top = Math.max(10, viewportHeight - 500 - 10);
                  }
                  
                  setPopupPosition({ top, left });
                }, 500); // 500ms longpress
                setLongPressTimer(timer);
              }
            }}
            onTouchEnd={() => {
              if (longPressTimer) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
              }
            }}
            onTouchMove={() => {
              if (longPressTimer) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
              }
            }}
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
