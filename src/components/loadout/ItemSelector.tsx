"use client";

import { getItemsByCategory, getBeads } from '@/data/items';
import { BaseItem, ItemCategory, Bead } from '@/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ItemCardPopup from '../common/ItemCardPopup';
import BeadCardPopup from '../common/BeadCardPopup';

// Define interface for Window with MSMaxTouchPoints
interface WindowWithMSTouchPoints extends Window {
  MSMaxTouchPoints?: number;
}

interface ItemSelectorProps {
  category: ItemCategory;
  onItemSelect: (item: BaseItem | Bead) => void;
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
  const [hoveredItem, setHoveredItem] = useState<BaseItem | Bead | null>(null);
  const [popupPosition, setPopupPosition] = useState<{top: number, left: number} | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<BaseItem | Bead | null>(null);
  
  // Effect to prevent background scrolling when modal is open
  useEffect(() => {
    if (showInfoModal) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showInfoModal]);
  
  // Detect if device is a touch device (mobile or tablet)
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for touch capability
      const hasTouchCapability = 'ontouchstart' in window || 
                               navigator.maxTouchPoints > 0 || 
                               ((window as WindowWithMSTouchPoints).MSMaxTouchPoints || 0) > 0;
      
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
      // For touch devices, any touch anywhere should close the popup (unless inside the popup)
      const handleTouchAnywhere = (e: TouchEvent) => {
        const popupElement = document.querySelector('.item-card-popup');
        if (popupElement && e.target instanceof Node) {
          if (popupElement.contains(e.target)) {
            return;
          }
        }
        setTimeout(() => {
          setHoveredItem(null);
          setPopupPosition(null);
        }, 10);
      };
      document.addEventListener('touchstart', handleTouchAnywhere);
      return () => {
        document.removeEventListener('touchstart', handleTouchAnywhere);
      };
    }
  }, [isTouchDevice, hoveredItem]);
  
  // Get items for the selected category
  const items: (BaseItem | Bead)[] = category === 'Beads' ? getBeads() : getItemsByCategory(category);
  
  // Filter items based on search query
  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    // If exclude toggle is NOT provided (e.g., Manager page), hide excluded items entirely
    .filter(item => (onItemExcludeToggle ? true : !excludedItems.includes(item.id)));

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
      
      {/* Info Modal Overlay */}
      {showInfoModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 cursor-default overflow-hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setShowInfoModal(null)}
        >
          <div className="backdrop-blur-sm absolute inset-0"></div>
          <div 
            className="max-h-[90vh] overflow-y-auto max-w-[95vw] py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {'element' in showInfoModal ? (
              <ItemCardPopup 
                item={showInfoModal} 
                isModal={true} 
                onClose={() => setShowInfoModal(null)} 
              />
            ) : (
              <BeadCardPopup 
                bead={showInfoModal} 
                isModal={true} 
                onClose={() => setShowInfoModal(null)} 
              />
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
        {hoveredItem && popupPosition && (
          <div 
            className="fixed pointer-events-none z-50" 
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`
            }}
          >
            {'element' in hoveredItem ? (
              <ItemCardPopup item={hoveredItem} />
            ) : (
              <BeadCardPopup bead={hoveredItem} />
            )}
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
            onClick={(e) => {
              // Check if the click is on the info button or its children
              const target = e.target as HTMLElement;
              const isInfoButton = target.tagName === 'BUTTON' || 
                                 target.parentElement?.tagName === 'BUTTON' ||
                                 target.textContent?.trim() === 'i';
              
              // Only trigger handleClick if it's not on the info button
              if (!isInfoButton) {
                handleClick();
              }
            }}
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
                
                // Calculate optimal position for the popup (similar to LoadoutSlot)
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
              
                // Estimate popup dimensions - weapons with mysteriums can be very tall
                const popupWidth = 288; // 72 * 4 = 288px (w-72 in tailwind)
                const popupHeight = 'element' in item ? 600 : 400; // Weapons need more height for mysteriums
              
                // Default placement is to the right, aligned with slot top
                let top = rect.top;
                let left = rect.right + 8;
                let placement = 'right';
                
                // Check if popup would go off the right edge of the screen
                if (left + popupWidth > viewportWidth) {
                  // Try left placement, aligned with slot top
                  left = rect.left - popupWidth - 8;
                  placement = 'left';
                  
                  // If left placement also doesn't work, try bottom or top
                  if (left < 0) {
                    if (rect.bottom + popupHeight < viewportHeight) {
                      // Place below, aligned with slot left
                      top = rect.bottom + 8;
                      left = rect.left;
                      placement = 'bottom';
                    } else {
                      // Place above, aligned with slot left
                      top = rect.top - popupHeight - 8;
                      left = rect.left;
                      placement = 'top';
                    }
                  }
                }
                
                // Check if popup would go off the bottom of the screen for right/left placement
                if ((placement === 'right' || placement === 'left') && top + popupHeight > viewportHeight) {
                  // Try to move popup above the item, aligning bottom with slot bottom
                  const aboveTop = rect.bottom - popupHeight;
                  if (aboveTop >= 8) {
                    top = aboveTop;
                  } else {
                    // If can't fit above, align with viewport bottom
                    top = viewportHeight - popupHeight - 8;
                  }
                }
                
                // Handle bottom placement going off screen
                if (placement === 'bottom' && top + popupHeight > viewportHeight) {
                  top = viewportHeight - popupHeight - 8;
                }
                
                // Final check if popup would go off the top of the screen
                if (top < 8) {
                  top = 8; // Add a small margin from the top
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
                  
                  // Estimate popup dimensions - weapons with mysteriums can be very tall
                  const popupWidth = 288; // 72 * 4 = 288px (w-72 in tailwind)
                  const popupHeight = 'element' in item ? 600 : 400; // Weapons need more height for mysteriums
                  
                  // For mobile, center horizontally and position below the item
                  let top = rect.bottom + 8;
                  const left = Math.max(10, (viewportWidth - popupWidth) / 2);
                  
                  // If popup would go off the bottom, place it above
                  if (top + popupHeight > viewportHeight) {
                    top = rect.top - popupHeight - 8;
                  }
                  
                  // Ensure popup doesn't go off the top
                  if (top < 0) {
                    top = 8;
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
            <div className="w-16 h-16 mb-2 bg-black rounded-md flex items-center justify-center">
              {item.iconUrl ? (
                <Image 
                  src={item.iconUrl} 
                  alt={item.name} 
                  width={64}
                  height={64}
                  className="w-full h-full object-contain rounded-md"
                />
              ) : null}
              <span className={`text-2xl text-black ${item.iconUrl ? 'hidden' : ''}`}>{item.name.charAt(0)}</span>
            </div>

            <span className="text-xs text-center text-gray-100 truncate w-full">{item.name}</span>

            {'element' in item && item.element && (
              <div 
                className="absolute top-1 right-1 w-3 h-3 rounded-full" 
                style={{ backgroundColor: getElementColor(item.element) }}
              />
            )}

            {/* Information Icon */}
            <button
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-[#ddaf7a] hover:bg-[#e9b87e] flex items-center justify-center text-white text-base font-bold transition-all z-10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setHoveredItem(null); // Close hover popup if open
                setShowInfoModal(item);
              }}
              title={`View ${item.name} details`}
            >
              i
            </button>
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
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
};

export default ItemSelector;
