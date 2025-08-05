/* eslint-disable @next/next/no-img-element */
"use client";

import { Bead } from '@/types';

interface BeadCardProps {
  bead: Bead;
}

const BeadCard = ({ bead }: BeadCardProps) => {
  return (
    <div className="bg-[#1A1A1A] relative rounded-lg overflow-hidden border border-[#818181] hover:border-[#ddaf7aa6] transition-colors flex flex-col">
      <img
        src="/images/texture-transparent.PNG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
      {/* Bead Header */}
      <div className="p-2 sm:p-4 bg-[#5c5b5bb9] flex items-center gap-2 sm:gap-4 sm:min-h-[8rem]">
        <div className="w-12 h-12 sm:w-18 sm:h-18 bg-black rounded-md flex items-center justify-center">
          {bead.iconUrl ? (
            <img 
              src={bead.iconUrl} 
              alt={bead.name} 
              className="w-full h-full object-contain rounded-md"
            />
          ) : (
            <span className="text-white text-2xl">{bead.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base sm:text-2xl font-bold text-white">{bead.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs sm:text-sm bg-[#ddaf7aa6] text-white px-2 py-1 rounded-md font-medium">
              Bead
            </span>
          </div>
        </div>
      </div>

      {/* Bead Content */}
      <div className="p-2 sm:p-4 flex-grow relative z-10">
        {/* Description */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#ddaf7aa6] mb-2">Description</h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {bead.description}
          </p>
        </div>

        {/* Requirements */}
        {bead.requirements && bead.requirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#ddaf7aa6] mb-2">Requirements</h4>
            <div className="space-y-2">
              {bead.requirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center bg-[#2a2a2a] rounded-md p-2">
                  <span className="text-xs sm:text-sm text-gray-300 font-medium capitalize">
                    {req.stat}
                  </span>
                  <span className="text-xs sm:text-sm text-white font-bold">
                    {req.value}+
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Requirements Message */}
        {(!bead.requirements || bead.requirements.length === 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#ddaf7aa6] mb-2">Requirements</h4>
            <p className="text-xs sm:text-sm text-gray-400 italic">
              No stat requirements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeadCard;
