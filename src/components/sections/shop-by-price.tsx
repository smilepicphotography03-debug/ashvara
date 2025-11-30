"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const priceCategories = [
  {
    text: "Under ₹99",
    image: "https://kuviyal.in/cdn/shop/files/Under_99_1.png",
    href: "/collections/under-99",
  },
  {
    text: "Under ₹199",
    image: "https://kuviyal.in/cdn/shop/files/Under_199.png",
    href: "/collections/under-199",
  },
  {
    text: "Under ₹499",
    image: "https://kuviyal.in/cdn/shop/files/Under_499.png",
    href: "/collections/under-499",
  },
  {
    text: "Under ₹799",
    image: "https://kuviyal.in/cdn/shop/files/Under_799.png",
    href: "/collections/under-799",
  },
  {
    text: "Under ₹999",
    image: "https://kuviyal.in/cdn/shop/files/Under_999.png",
    href: "/collections/under-999",
  },
  {
    text: "Above ₹1000",
    image: "https://kuviyal.in/cdn/shop/files/Above_1000.png",
    href: "/collections/above-1000",
  },
];

const ShopByPrice = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center text-primary-text mb-10">
          Shop by price
        </h2>
        
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-4">
            {priceCategories.map((category, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                <Link href={category.href} className="block group">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={category.image}
                      alt={category.text}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16.6vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex items-center justify-center bg-white rounded-full shadow-md w-12 h-12 border border-border text-primary-text hover:bg-gray-100 transition-colors z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:flex items-center justify-center bg-white rounded-full shadow-md w-12 h-12 border border-border text-primary-text hover:bg-gray-100 transition-colors z-10" />
        </Carousel>

        <div className="flex justify-center space-x-2 pt-8">
            { priceCategories.map((_, index) => {
              // The original site has 3 dots, suggesting pages. This implementation uses a dot per item for simplicity.
              // To match pages, you'd need to know items per page and calculate pages.
              return (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                    current === index ? 'bg-zinc-900' : 'bg-zinc-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ShopByPrice;