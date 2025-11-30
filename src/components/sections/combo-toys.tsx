"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  image: string;
  save: string;
  hasLowStock: boolean;
  title: string;
  price: string;
  originalPrice: string;
}

const comboProducts: Product[] = [
  {
    id: 1,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/61Nwy8saPLL_1-16.jpg",
    save: "500.00",
    hasLowStock: true,
    title: "Combo4 (Budget Friendly Combo)",
    price: "299.00",
    originalPrice: "799.00",
  },
  {
    id: 2,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/4ca7a281-dcdf-4909-aff1-815dc76cbba2_1800x1800_1-17.jpg",
    save: "200.00",
    hasLowStock: true,
    title: "Budget Friendly - 7 Toys Combo",
    price: "499.00",
    originalPrice: "699.00",
  },
  {
    id: 3,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/51N3eb8uOCL__SL1200__1-18.jpg",
    save: "189.00",
    hasLowStock: true,
    title: "8 Toys Combo",
    price: "700.00",
    originalPrice: "889.00",
  },
  {
    id: 4,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/51cLuf2OrmL-19.jpg",
    save: "300.00",
    hasLowStock: true,
    title: "999 Combo",
    price: "999.00",
    originalPrice: "1,299.00",
  },
  {
    id: 5,
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/61Nwy8saPLL_1-16.jpg",
    save: "500.00",
    hasLowStock: false,
    title: "Combo4 (Budget Friendly Combo)",
    price: "299.00",
    originalPrice: "799.00",
  },
];

const QuantitySelector = ({ quantity, onDecrement, onIncrement }: { quantity: number; onDecrement: () => void; onIncrement: () => void }) => {
    return (
        <div className="flex items-center border border-[#dddddd] rounded-[4px] h-[38px]">
            <button onClick={onDecrement} className="w-[38px] h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors rounded-l-[4px]">
                <Minus size={14} />
            </button>
            <input 
                type="text" 
                value={quantity} 
                readOnly 
                className="w-[38px] h-full text-center border-l border-r border-[#dddddd] text-sm font-medium text-primary-text bg-white focus:outline-none"
            />
            <button onClick={onIncrement} className="w-[38px] h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors rounded-r-[4px]">
                <Plus size={14} />
            </button>
        </div>
    );
};

const ProductCard = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = React.useState(1);
    const [isAdding, setIsAdding] = React.useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(product.id, quantity);
            setQuantity(1);
        } finally {
            setIsAdding(false);
        }
    };

    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/products/${product.id}`);
    };

    return (
        <div className="relative group p-4 bg-white border border-[#eeeeee] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col h-full">
            <div className="relative mb-4">
                <a href={`/products/${product.id}`} onClick={handleProductClick} className="cursor-pointer">
                    <div className="relative w-full aspect-square overflow-hidden rounded-[6px]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                </a>
                <div className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded-sm shadow">
                  <span className="text-xs font-medium text-[#ff5722]">Save Rs. {product.save}</span>
                </div>
                {product.hasLowStock && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-medium text-[#ff5722]">Low stock</span>
                  </div>
                )}
            </div>

            <div className="flex flex-col flex-grow">
                <h3 className="text-base font-medium text-[#212121] leading-tight mb-1 h-10 line-clamp-2">
                    <a href={`/products/${product.id}`} onClick={handleProductClick} className="hover:underline cursor-pointer">
                        {product.title}
                    </a>
                </h3>
                <p className="text-xs text-[#999999] mb-2">Kuviyal</p>
                <div className="flex items-baseline mb-4 mt-auto">
                    <span className="text-lg font-semibold text-[#212121]">Rs. {product.price}</span>
                    <span className="text-sm text-[#999999] line-through ml-2">Rs. {product.originalPrice}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <QuantitySelector 
                        quantity={quantity}
                        onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
                        onIncrement={() => setQuantity(q => q + 1)}
                    />
                    <Button 
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="flex-grow bg-[#e91e63] text-white h-[38px] text-sm font-medium rounded-[4px] hover:bg-[#d81b60] transition-colors disabled:opacity-50"
                    >
                        {isAdding ? "Adding..." : "Add to cart"}
                    </Button>
                </div>
            </div>
        </div>
    );
};


const ComboToys = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

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
        <section className="bg-white py-12 md:py-16 lg:py-20">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6 lg:mb-8">
                    <h2 className="text-[32px] font-semibold text-[#212121] -tracking-[0.01em]">
                        Combo Toys
                    </h2>
                </div>

                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="relative"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="ml-[-1rem]">
                        {comboProducts.map((product) => (
                            <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                               <div className="h-full">
                                    <ProductCard product={product} />
                               </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-black shadow-md w-10 h-10 rounded-full hover:bg-neutral-100 disabled:opacity-50" />
                    <CarouselNext className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white text-black shadow-md w-10 h-10 rounded-full hover:bg-neutral-100 disabled:opacity-50" />
                </Carousel>
                
                <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: Math.ceil(comboProducts.length / 4) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i * 4)}
                            className={`h-2.5 w-2.5 rounded-full transition-colors ${i === Math.floor(current / 4) ? 'bg-zinc-800' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                        />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button asChild className="bg-[#212121] text-white rounded-full py-[10px] px-6 h-auto text-sm font-medium hover:bg-zinc-700 transition-colors">
                        <a href="/collections/deals">View All Deals</a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ComboToys;