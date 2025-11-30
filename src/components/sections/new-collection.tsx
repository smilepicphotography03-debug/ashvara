"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  image: string | null;
  savePrice?: number;
  salePrice: number;
  originalPrice: number;
  vendor: string;
  lowStock: boolean;
  pricePrefix?: string;
  variants?: boolean;
  variantText?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Flexible Magnetic Block 25Pcs",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/89e2a6a0f35d21a8f0ade58d7458cf51-8.webp",
    savePrice: 348,
    salePrice: 650,
    originalPrice: 998,
    vendor: "Kuviyal",
    lowStock: true,
  },
  {
    id: 2,
    name: "SOCCER ROBOT (1 Pc)",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/510M6Upx-DL-9.jpg",
    savePrice: 500,
    salePrice: 1099,
    originalPrice: 1599,
    vendor: "Kuviyal",
    lowStock: true,
  },
  {
    id: 3,
    name: "COLOUR CHANGING ALLOY CAR(1 Pc)",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/41A6yxQbmFL-10.jpg",
    pricePrefix: "From",
    salePrice: 135,
    originalPrice: 699,
    vendor: "Kuviyal",
    lowStock: true,
    variants: true,
    variantText: "3 more variants",
  },
  {
    id: 4,
    name: "Hot Wheel 2pcs (Random Design)",
    image: null,
    savePrice: 269,
    salePrice: 130,
    originalPrice: 399,
    vendor: "Kuviyal",
    lowStock: true,
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding
    } finally {
      setIsAdding(false);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start">
      <div className="bg-card border border-border-divider rounded-lg p-4 flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300">
        <div className="relative mb-4">
          <a href={`/products/${product.id}`} onClick={handleProductClick} className="block cursor-pointer">
            <div className="aspect-square w-full relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No Image</span>
                </div>
              )}
            </div>
          </a>
          {product.savePrice && (
            <div className="absolute top-2 left-2 text-xs font-medium text-[#FF5722]">
              Save Rs. {product.savePrice.toFixed(2)}
            </div>
          )}
          {product.lowStock && (
            <div className="absolute top-2 right-2 text-xs font-medium text-[#FF9800]">
              Low stock
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary-text">
              {product.pricePrefix && `${product.pricePrefix} `}Rs. {product.salePrice.toFixed(2)}
            </span>
            <s className="text-sm text-price-strike">Rs. {product.originalPrice.toFixed(2)}</s>
          </div>
          <h3 className="text-base font-medium text-primary-text mt-2 h-10 leading-tight overflow-hidden">
            <a href={`/products/${product.id}`} onClick={handleProductClick} className="hover:underline cursor-pointer">{product.name}</a>
          </h3>
          <p className="text-xs text-secondary-text mt-1">{product.vendor}</p>

          <div className="mt-auto pt-4">
            {product.variants ? (
              <>
                <p className="text-center text-xs text-secondary-text mb-2">{product.variantText}</p>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full border border-primary-text text-primary-text bg-transparent text-sm font-medium py-2 px-4 rounded-[4px] hover:bg-secondary transition-colors duration-200 disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Quick Add"}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border border-border rounded-[4px]">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-2 text-secondary-text hover:bg-secondary rounded-l-[3px] transition-colors"><Minus size={16} /></button>
                  <span className="font-medium text-sm text-primary-text">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-3 py-2 text-secondary-text hover:bg-secondary rounded-r-[3px] transition-colors"><Plus size={16}/></button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-primary text-primary-foreground text-sm font-medium py-2 px-4 rounded-[4px] hover:bg-opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add to cart"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewCollection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPrevVisible, setIsPrevVisible] = useState(false);
  const [isNextVisible, setIsNextVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsPrevVisible(scrollLeft > 0);
    setIsNextVisible(scrollLeft < scrollWidth - clientWidth - 1);
    
    const cardWidth = scrollWidth / products.length;
    const newActiveIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newActiveIndex);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    
    let scrollAmount = clientWidth * 0.8;
    if (direction === "left") {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <section className="bg-background py-10 md:py-16 lg:py-20">
      <div className="container mx-auto px-5 md:px-10 lg:px-15">
        <h2 className="text-3xl font-semibold text-primary-text text-left mb-8">
          New Collection
        </h2>

        <div className="relative">
          {isPrevVisible && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-secondary transition-all"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-6 h-6 text-primary-text" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {isNextVisible && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-secondary transition-all"
              aria-label="Next product"
            >
              <ChevronRight className="w-6 h-6 text-primary-text" />
            </button>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
            {products.map((_, index) => (
                <span key={index} className={`block w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === index ? 'bg-primary' : 'bg-border'}`}></span>
            ))}
        </div>

        <div className="text-center mt-12">
            <a
                href="#"
                className="inline-block bg-primary-text text-primary-background text-sm font-medium py-3 px-8 rounded-[4px] hover:opacity-90 transition-opacity"
            >
                View all
            </a>
        </div>
      </div>
    </section>
  );
}