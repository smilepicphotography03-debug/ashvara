"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ageCategories = [
  {
    label: "1-2 YEARS",
    href: "/collections/1-2-years-baby-toys",
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/1-2_yEARS-12.png",
    width: 231,
    height: 208,
  },
  {
    label: "2-3 YEARS",
    href: "/collections/2-3-year-baby-toys",
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/2-3_yEARS-13.png",
    width: 231,
    height: 208,
  },
  {
    label: "3-5 YEARS",
    href: "/collections/3-year-baby-toys",
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/2-3_yEARS_1-14.png",
    width: 231,
    height: 208,
  },
  {
    label: "5+ YEARS",
    href: "/collections/5-years",
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/2-3_yEARS_2_57e1ca65-b339-4fef-8c3c-2d43b8112f40-15.png",
    width: 231,
    height: 208,
  },
  {
    label: "0-1 YEAR",
    href: "/collections/0-1-year-baby-toys",
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/0-1_YEAR-11.png",
    width: 231,
    height: 208,
  },
];

const ShopByAge = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      if (!hasOverflow) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const check = () => setTimeout(checkScrollability, 100);
    check();

    window.addEventListener("resize", check);
    container.addEventListener("scroll", checkScrollability, { passive: true });

    return () => {
      window.removeEventListener("resize", check);
      container.removeEventListener("scroll", checkScrollability);
    };
  }, [checkScrollability]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-background py-10 md:py-[60px] lg:py-20">
      <div className="container">
        <h2 className="text-center text-[2rem] font-semibold text-primary-text mb-12 tracking-[-0.01em]">
          Shop by age
        </h2>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth gap-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ageCategories.map((category) => (
              <Link
                href={category.href}
                key={category.label}
                className="block flex-shrink-0 group rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              >
                <Image
                  src={category.imgSrc}
                  alt={`Shop by age ${category.label}`}
                  width={category.width}
                  height={category.height}
                  className="rounded-lg w-[231px] h-auto"
                />
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-opacity duration-300 hidden md:flex items-center justify-center left-[-20px] ${
                canScrollLeft ? 'opacity-100 hover:bg-gray-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-primary-text" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-opacity duration-300 hidden md:flex items-center justify-center right-[-20px] ${
                canScrollRight ? 'opacity-100 hover:bg-gray-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="h-5 w-5 text-primary-text" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByAge;