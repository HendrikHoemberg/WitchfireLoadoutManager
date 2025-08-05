/* eslint-disable @next/next/no-img-element */
"use client";

import { Bead } from '@/types';

interface BeadCardPopupProps {
  bead: Bead;
}

const BeadCardPopup = ({ bead }: BeadCardPopupProps) => {
  return (
    <div className="bead-card-popup absolute z-50 w-72 bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#818181] shadow-lg">
      <img
        src="/images/texture-transparent.PNG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
      {/* Bead Header */}
      <div className="p-2 bg-[#5c5b5bb9] flex items-center gap-2">
        <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center">
          <img 
            src={bead.iconUrl} 
            alt={bead.name} 
            className="w-full h-full object-contain rounded-md"
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base font-bold text-left text-white">{bead.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">Bead</span>
          </div>
        </div>
      </div>
      
      {/* Bead Description */}
      <div className="p-3 relative z-10">
        <div className="mb-3">
          <p className="text-sm text-gray-300 leading-relaxed">{bead.description}</p>
        </div>
        
        {/* Requirements Section */}
        {bead.requirements && bead.requirements.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
            <div className="space-y-1">
              {bead.requirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 capitalize">{req.stat}:</span>
                  <span className="text-[#ddaf7aa6] font-semibold">{req.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeadCardPopup;
