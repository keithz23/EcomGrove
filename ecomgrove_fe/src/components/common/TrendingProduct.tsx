"use client";
import { productData } from "@/app/constants/ProductData";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ButtonItem = [
  { id: 1, name: "New" },
  { id: 2, name: "Featured" },
  { id: 3, name: "Top Sellers" },
];


export default function TrendingProduct() {
  const [active, setActive] = useState<string>("New");

  return (
    <section className="max-w-7xl mx-auto py-10 px-5">
      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3">
        {/* Title */}
        <div className="relative inline-block">
          <h1 className="text-3xl md:text-4xl font-semibold relative z-10">
            Trending Product
          </h1>
          <svg
            width="114"
            height="35"
            viewBox="0 0 114 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 top-0 text-pink-vibe mt-5 -z-10"
          >
            <path
              d="M112 23.275C1.84952 -10.6834 -7.36586 1.48086 7.50443 32.9053"
              stroke="currentColor"
              strokeWidth="4"
              strokeMiterlimit="3.8637"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Divide */}
        <div className="flex flex-col justify-center">
          <div className="border-t-1"></div>
        </div>

        {/* Button */}
        <div className="flex justify-center gap-5">
          {ButtonItem.map((bi) => (
            <button
              key={bi.id}
              className={`text-xl text-neutral-gray font-semibold cursor-pointer`}
              onClick={() => {
                setActive(bi.name);
              }}
            >
              <span className={`${active == bi.name ? "text-mid-night" : ""}`}>
                {bi.name}
              </span>
              {active == bi.name && (
                <svg
                  width="52"
                  height="13"
                  viewBox="0 0 52 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-electric-blue -mt-2"
                >
                  <path
                    d="M1 8.97127C11.6061 -5.48521 33 3.99996 51 11.4635"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeMiterlimit="3.8637"
                    strokeLinecap="round"
                  ></path>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product */}
      <div className="grid grid-cols-1 gap-6 cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 my-5">
        {productData?.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded hover:shadow-lg"
          >
            <div className="relative w-full aspect-[2/3]">
              <Image
                src={item.imagePath?.[0]?.url || ""}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>

            <div className="p-5 border-t-2">
              <span className="block mb-2 text-sm text-mid-night font-semibold line-clamp-2">
                {item.categories}
              </span>
              <span className="block mb-2 text-md text-mid-night font-semibold line-clamp-2">
                {item.name}
              </span>
              <div className="flex justify-between">
                <span className="text-xl font-bold text-electric-blue">
                  ${item.price}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 absolute right-4 bottom-32 p-3 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer z-10 shadow-lg">
              <div className="relative group">
                <Heart className="w-5 h-5 hover:text-red-500 transition" />
              </div>
              <div className="relative group">
                <Eye className="w-5 h-5 hover:text-blue-400 transition" />
              </div>
              <div className="relative group">
                <ShoppingCart className="w-5 h-5 hover:text-green-400 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
