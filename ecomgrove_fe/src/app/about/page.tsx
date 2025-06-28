"use client";
import React from "react";
import SubHeader from "@/components/Header/SubHeader";
import { CounterItem } from "../constants/AboutData";
import Footer from "@/components/Footer/Footer";
import { useWindowEvents } from "../hooks/useWindowsEvent";
import Cart from "@/components/cart/Cart";
import { useCartStore } from "../store/cart/useCartStore";
import TopHeader from "@/components/about/TopHeader";
import Image from "next/image";

export default function About() {
  const { isScrolledY } = useWindowEvents();
  const { isCartOpen, closeCart } = useCartStore();

  return (
    <div className="selection:bg-mid-night selection:text-white">
      {/* Top Header */}
      <TopHeader />

      {/* Navbar */}
      <div
        className={`sticky top-0 w-full z-20 bg-white transition-all duration-300 ease-in-out ${
          isScrolledY ? "shadow-md opacity-100" : "shadow-sm opacity-95"
        }`}
      >
        <SubHeader />
      </div>

      {/* Content */}
      <section className="max-w-7xl mx-auto py-5 sm:py-10 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="my-5 sm:my-10">
          <span className="text-electric-blue text-sm sm:text-base">
            History
          </span>
          <h1 className="text-mid-night text-2xl sm:text-4xl md:text-6xl lg:text-8xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
            Well-coordinated Teamwork Speaks About Us
          </h1>
        </div>

        {/* Image area */}
        <Image
          src="/assets/about-big-1.jpg"
          alt="About us"
          width={1200}
          height={600}
          className="object-cover rounded-lg"
        />

        {/* About area */}
        <section className="max-w-5xl mx-auto p-3 sm:p-5 text-sm sm:text-base lg:text-lg text-dark-gray">
          <p className="mb-5 sm:mb-10 leading-relaxed">
            We are thrilled to offer you a wide range of products that you won't
            find anywhere else. Whether you're shopping for clothing,
            accessories, gadgets, or home decor, we have something for everyone.
          </p>
          <p className="leading-relaxed">
            Our commitment to quality is reflected in every product we offer. We
            work with top suppliers and manufacturers to ensure that every item
            we sell meets our high standards for durability, performance, and
            style. And with a user-friendly interface and intuitive navigation,
            shopping on our site is a breeze. We understand that security is a
            top concern for online shoppers, which is why we employ the latest
            encryption technologies and follow industry best practices to keep
            your personal information safe. And with fast, reliable shipping
            options, you can enjoy your purchases in no time.
          </p>
        </section>

        {/* Counter area */}
        <section className="py-5 sm:py-10 px-4 sm:px-12 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-4">
            {CounterItem.map((ci) => (
              <div
                className="flex gap-3 justify-center sm:justify-start"
                key={ci.id}
              >
                {ci.svg}

                <div className="text-center sm:text-left">
                  <h4 className="text-mid-night text-3xl sm:text-4xl lg:text-5xl font-bold">
                    {ci.title}
                  </h4>
                  <p className="text-base sm:text-lg lg:text-xl text-dark-gray">
                    {ci.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* History area */}
      <section className="bg-[#f8f8f8]">
        <div className="p-20">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="">
              <h1 className="text-mid-night text-4xl font-semibold">
                About our <p>Online Store</p>
              </h1>
              <p className="my-5 sm:mb-10 leading-relaxed text-dark-gray">
                At our eCommerce site, we are passionate about providing our
                customers with the best possible shopping experience. From our
                extensive product selection to our exceptional customer service,
                we are committed to exceeding your expectations.
              </p>
              <p className="leading-relaxed text-dark-gray">
                So start browsing today and find the perfect products to suit
                your needs!
              </p>

              <p className="text-[#e7e7e7] text-[100px] my-10 font-semibold tracking-widest">
                2016
              </p>
            </div>
            <div className="col-span-2 mx-auto relative">
              <div className="p-1 border">
                <Image
                  src="/assets/history-1.jpg"
                  alt="Historical image of the company"
                  className="object-cover"
                  priority
                  width={600}
                  height={1200}
                />
              </div>

              <div className="absolute p-5 bg-white bottom-60 -left-12 shadow-md">
                <p className="italic">
                  Welcome to our <br /> Shofy eCommerce Theme
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer  */}
      <Footer />

      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}
