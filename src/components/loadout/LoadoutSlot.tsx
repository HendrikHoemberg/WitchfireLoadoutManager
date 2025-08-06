/* eslint-disable @next/next/no-img-element */
"use client";

import { BaseItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import ItemCardPopup from '../common/ItemCardPopup';

// Define interface for Window with MSMaxTouchPoints
interface WindowWithMSTouchPoints extends Window {
  MSMaxTouchPoints?: number;
}

interface LoadoutSlotProps {
  item: BaseItem | null;
  category: string;
  isSelected?: boolean;
  onClick?: () => void;
  isGenerating?: boolean;
  isLocked?: boolean;
  onLockToggle?: () => void;
}

const LoadoutSlot = ({ item, category, isSelected = false, onClick, isGenerating = false, isLocked = false }: LoadoutSlotProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{top: number, left: number, placement: 'right' | 'left' | 'top' | 'bottom'}>({
    top: 0,
    left: 0,
    placement: 'right'
  });
  const slotRef = useRef<HTMLDivElement>(null);
  
  // Calculate the best position for the popup to avoid being cut off
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // State to track white fill animation phase
  const [showWhiteFill, setShowWhiteFill] = useState(false);
  const [showWhiteFadeOut, setShowWhiteFadeOut] = useState(false);
  
  // Use refs to track timer IDs for better cleanup
  const fillTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track the previous isGenerating value to detect changes
  const prevIsGeneratingRef = useRef(isGenerating);

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
      const handleTouchAnywhere = (e: TouchEvent) => {
        // Check if the touch is inside the popup
        const popupElement = document.querySelector('.item-card-popup');
        if (popupElement && e.target instanceof Node) {
          // If the touch is inside the popup, don't close it
          if (popupElement.contains(e.target)) {
            return;
          }
        }
        
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
  
  // Prevent page scrolling when info modal is open
  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showInfoModal]);

  // Handle the white fill animation timing when isGenerating changes
  // Use a more synchronized approach to ensure consistent timing
  useEffect(() => {
    // Clean up any existing timers first to avoid race conditions
    if (fillTimerRef.current) {
      clearTimeout(fillTimerRef.current);
      fillTimerRef.current = null;
    }
    
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    
    // Only trigger new animations when isGenerating changes and slot is not locked
    if (isGenerating !== prevIsGeneratingRef.current) {
      prevIsGeneratingRef.current = isGenerating;
      
      if (isGenerating && !isLocked) {
        // Start the fill animation immediately
        setShowWhiteFill(true);
        setShowWhiteFadeOut(false);
        
        // Schedule the fade out transition - using 800ms for main animation (80% of 1s)
        fillTimerRef.current = setTimeout(() => {
          fillTimerRef.current = null;
          setShowWhiteFill(false);
          setShowWhiteFadeOut(true);
          
          // Schedule the complete removal of the animation - 200ms for fade-out (20% of 1s)
          fadeOutTimerRef.current = setTimeout(() => {
            fadeOutTimerRef.current = null;
            setShowWhiteFadeOut(false);
          }, 200); // 200ms fade-out period
        }, 800); // 800ms main animation
      } else if (showWhiteFill) {
        // Start fade out if we were in the middle of fill
        setShowWhiteFill(false);
        setShowWhiteFadeOut(true);
        
        // Schedule the complete removal of the animation
        fadeOutTimerRef.current = setTimeout(() => {
          fadeOutTimerRef.current = null;
          setShowWhiteFadeOut(false);
        }, 200); // Match the fadeout timing with the above
      }
    }
    
    // Clean up timers on unmount
    return () => {
      if (fillTimerRef.current) clearTimeout(fillTimerRef.current);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    };
  }, [isGenerating, showWhiteFill, isLocked]);

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

  // Define the glow animation class based on isGenerating state
  // Enhanced animation with more intense glow and outer glow effect
  // Don't apply animations to locked slots
  const generatingAnimationClass = (isGenerating && !isLocked) 
    ? 'animate-glow-pulse shadow-glow' 
    : '';

  return (
    <div 
      ref={slotRef}
      className={`
        relative flex flex-col items-center 
        w-30 h-30 sm:w-34 sm:h-34 rounded-lg 
        ${isSelected ? 'border-2 border-[#ddaf7aa6]' : isLocked ? 'border-2 border-red-900 hover:border-red-800' : (isGenerating && !isLocked) ? `border ${generatingAnimationClass}` : 'border border-[#818181]'} 
        ${item ? 'bg-[#505050]' : 'bg-opacity-50 bg-[#30303025]'} 
        transition-all duration-200 cursor-pointer ${!isLocked ? 'hover:border-[#ddaf7aa6]' : ''}
      `}
      style={{
        // Add dynamic style for the glow effect when generating
        // Don't apply glow to locked slots
        boxShadow: (isGenerating && !isLocked) ? undefined : 'none'
      }}
      onClick={(e) => {
        // Check if the click is on the info button or its children (including overlay)
        const target = e.target as HTMLElement;
        const isInfoButton = target.tagName === 'BUTTON' || 
                           target.parentElement?.tagName === 'BUTTON' ||
                           target.closest('button') !== null ||
                           target.textContent?.trim() === 'i';
        
        // Only trigger onClick if it's not on the info button
        if (!isInfoButton && onClick) {
          onClick();
        }
      }}
      onMouseEnter={() => !isTouchDevice && item && setShowPopup(true)}
      onMouseLeave={() => !isTouchDevice && setShowPopup(false)}
    >
      {/* White fill overlay for the animation */}
      {(showWhiteFill || showWhiteFadeOut) && (
        <div 
          className={`absolute inset-0 z-10 rounded-lg pointer-events-none ${showWhiteFill ? 'white-fill-in' : ''} ${showWhiteFadeOut ? 'white-fill-out' : ''}`}
        ></div>
      )}
      
      {item ? (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              {/* Display the item icon or fallback to first letter */}
              <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
                {item.iconUrl ? (
                  <img 
                    src={item.iconUrl} 
                    alt={item.name} 
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : null}
                <span className={`text-2xl text-black ${item.iconUrl ? 'hidden' : ''}`}>{item.name.charAt(0)}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className={`text-xs text-center truncate w-full px-1 block ${isLocked ? 'text-red-700' : 'text-white'}`}>{item.name}</span>
          </div>
          {item.element && (
            <div className="absolute top-1 right-1 w-6 h-6 rounded-full" 
                 style={{ backgroundColor: getElementColor(item.element) }}>
            </div>
          )}
          
          {/* Information Icon */}
          <button
            className="absolute top-1 left-1 w-6 h-6 rounded-full bg-[#ddaf7a] hover:bg-[#e9b87e] flex items-center justify-center text-white text-base font-bold transition-all z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(false); // Close hover popup if open
              setShowInfoModal(true);
            }}
            title="View item details"
          >
            i
            {/* White animation overlay for information icon */}
            <div
              className={`absolute inset-0 rounded-full pointer-events-none ${showWhiteFill ? 'white-fill-in' : ''} ${showWhiteFadeOut ? 'white-fill-out' : ''}`}
            ></div>
          </button>
          
          {/* Lock Button removed as requested */}
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
          
          {/* Information Modal Overlay */}
          {showInfoModal && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 cursor-default overflow-hidden"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.75)' // 75% opacity black background
              }}
              onClick={() => setShowInfoModal(false)}
            >
              <div 
                className="max-h-[90vh] overflow-y-auto max-w-[95vw] py-4"
                onClick={(e) => e.stopPropagation()}
              >
                <ItemCardPopup item={item} isModal={true} onClose={() => setShowInfoModal(false)} />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#868686b9] rounded-md opacity-30">
              <span className="text-3xl text-white">+</span>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className={`text-xs text-center block px-1 ${isLocked ? 'text-red-700' : 'text-white'}`}>{getCategoryDisplayName(category, slotIndex)}</span>
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
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
};

export default LoadoutSlot;
