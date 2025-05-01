"use client";

import { BaseItem } from '@/types';
import { useState, useRef, useEffect } from 'react';
import ItemCardPopup from '../common/ItemCardPopup';

interface LoadoutSlotProps {
  item: BaseItem | null;
  category: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const LoadoutSlot = ({ item, category, isSelected = false, onClick }: LoadoutSlotProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{top: number, left: number, placement: 'right' | 'left' | 'top' | 'bottom'}>({
    top: 0,
    left: 0,
    placement: 'right'
  });
  const slotRef = useRef<HTMLDivElement>(null);
  
  // Calculate the best position for the popup to avoid being cut off
  // Handle long press for mobile devices
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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
  
  useEffect(() => {
    if (showPopup && slotRef.current && item) {
      const slotRect = slotRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Estimate popup dimensions (adjust these values based on your actual popup size)
      const popupWidth = 288; // 72 * 4 = 288px (w-72 in tailwind)
      const popupHeight = 500; // Increased height estimate to prevent cut-off
      
      // Default placement is to the right
      let placement: 'right' | 'left' | 'top' | 'bottom' = 'right';
      let top = slotRect.top;
      let left = slotRect.right + 8;
      
      // Check if popup would go off the right edge of the screen
      if (left + popupWidth > viewportWidth) {
        // Try left placement
        left = slotRect.left - popupWidth - 8;
        placement = 'left';
        
        // If left placement also doesn't work, try bottom or top
        if (left < 0) {
          if (slotRect.bottom + popupHeight < viewportHeight) {
            // Place below
            top = slotRect.bottom + 8;
            left = slotRect.left;
            placement = 'bottom';
          } else {
            // Place above
            top = slotRect.top - popupHeight - 8;
            left = slotRect.left;
            placement = 'top';
          }
        }
      }
      
      // Check if popup would go off the bottom of the screen
      if (top + popupHeight > viewportHeight && (placement === 'right' || placement === 'left')) {
        // Adjust top position to align bottom of popup with bottom of viewport
        top = viewportHeight - popupHeight - 8;
      }
      
      // Check if popup would go off the top of the screen
      if (top < 0) {
        top = 8; // Add a small margin from the top
      }
      
      setPopupPosition({ top, left, placement });
    }
  }, [showPopup, item]);
  
  // Handle touch events on touch devices (mobile/tablet)
  useEffect(() => {
    if (isTouchDevice && showPopup) {
      // For touch devices, any touch anywhere should close the popup
      const handleTouchAnywhere = () => {
        // Add a small delay to allow the touch to register properly
        setTimeout(() => {
          setShowPopup(false);
        }, 10);
      };
      
      // Add the event listener to the document
      document.addEventListener('touchstart', handleTouchAnywhere);
      
      // Clean up the event listener when component unmounts or popup closes
      return () => {
        document.removeEventListener('touchstart', handleTouchAnywhere);
      };
    }
  }, [isTouchDevice, showPopup]);
  // Determine the display name for the category
  const getCategoryDisplayName = (category: string, slotIndex?: number) => {
    switch (category) {
      case 'Weapons': 
        return slotIndex === 0 ? 'Primary' : 'Secondary';
      case 'DemonicWeapons': return 'Demonic';
      case 'LightSpells': return 'Light Spell';
      case 'HeavySpells': return 'Heavy Spell';
      default: return category;
    }
  };
  
  // Determine which slot index this is for weapons
  const slotIndex = category === 'Weapons' && onClick ? 
    onClick.toString().includes('primaryWeapon') ? 0 : 1 : undefined;

  return (
    <div 
      ref={slotRef}
      className={`
        relative flex flex-col items-center 
        w-24 h-24 sm:w-34 sm:h-34 rounded-lg 
        ${isSelected ? 'border-2 border-[#ddaf7aa6]' : 'border border-[#818181]'} 
        ${item ? 'bg-[#505050]' : 'bg-opacity-50 bg-[#30303025]'} 
        transition-all duration-200 cursor-pointer hover:border-[#ddaf7aa6]
      `}
      onClick={onClick}
      onMouseEnter={() => !isTouchDevice && item && setShowPopup(true)}
      onMouseLeave={() => !isTouchDevice && setShowPopup(false)}
      onTouchStart={() => {
        if (isTouchDevice && item) {
          const timer = setTimeout(() => {
            setShowPopup(true);
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
      {item ? (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24">
              {/* Placeholder for the actual image - in a real app you'd use the item.iconUrl */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                {/* This is a placeholder. In a real app, you'd use Image component with the actual image */}
                <span className="text-2xl text-black">{item.name.charAt(0)}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className="text-xs text-center text-white truncate w-full px-1 block">{item.name}</span>
          </div>
          {item.element && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full" 
                 style={{ backgroundColor: getElementColor(item.element) }}>
            </div>
          )}
          {showPopup && (
            <div 
              className="fixed z-50 item-card-popup" 
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`
              }}
            >
              <ItemCardPopup item={item} />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-[#868686b9] rounded-md opacity-30">
              <span className="text-3xl text-white">+</span>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className="text-xs text-center text-white block px-1">{getCategoryDisplayName(category, slotIndex)}</span>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to get color for element
const getElementColor = (element: string): string => {
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Ice': return '#4da6ff';
    case 'Lightning': return '#ffcc00';
    case 'Decay': return '#66cc66';
    default: return '#cccccc';
  }
};

export default LoadoutSlot;
