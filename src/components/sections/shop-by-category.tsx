"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Puzzles",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/41IGGdW9TYL__SL1024-3.jpg",
    href: "#",
  },
  {
    name: "Musical Toys",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/51E4Vv4EAhL-4.jpg",
    href: "#",
  },
  {
    name: "Books",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/28-5.png",
    href: "#",
  },
  {
    name: "Flash Cards",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/61FLklGhoXL__SL1500-6.jpg",
    href: "#",
  },
  {
    name: "Bags",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/616rnKkDA6L__SL1500-7.jpg",
    href: "#",
  },
  // Adding another one for better loop visualization
   {
    name: "Puzzles",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/41IGGdW9TYL__SL1024-3.jpg",
    href: "#",
  },
];

export default function ShopByCategory() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const filteredScrollSnaps = api.scrollSnapList().filter((snap, index, list) => list.indexOf(snap) === index);
    setCount(filteredScrollSnaps.length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api]);

  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-center text-[32px] font-semibold text-foreground tracking-[-0.01em] mb-12">
          Shop by category
        </h2>
        <div className="relative px-12 md:px-14">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {categories.map((category, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-2/3 min-[480px]:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 group"
                >
                  <Link href={category.href} className="block text-center">
                    <div className="overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
                      <div className="aspect-square relative flex items-center justify-center p-2">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={240}
                          height={240}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-base font-medium text-foreground">
                      {category.name}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-[calc(50%+1.5rem)] w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-foreground hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-[calc(50%+1.5rem)] w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-foreground hover:bg-gray-100 transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </Carousel>
          <div className="flex justify-center gap-1.5 mt-10">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === current ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}