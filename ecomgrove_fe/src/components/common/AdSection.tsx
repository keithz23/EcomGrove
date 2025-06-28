import { AdSectionData } from "@/app/constants/AdData";
import React from "react";

export default function AdSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AdSectionData.map((ads) => (
          <div
            key={ads.id}
            className="bg-white shadow-sm rounded-md p-5 flex items-center gap-4 h-28"
          >
            <div className="text-pink-500 text-4xl flex-shrink-0">
              {ads.icon}
            </div>
            <div>
              <h4 className="text-mid-night font-bold text-base">
                {ads.title}
              </h4>
              <p className="text-dark-gray text-sm">{ads.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
