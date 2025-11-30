"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface Slide {
  title: string;
  description: string;
  buttonText: string;
  placeholderBg: string;
  overlay: string;
}

const carouselSlides: Slide[] = [
  {
    title: "Learn Through Play",
    description: "Our educational toys blend fun with learning to offer your child an engaging experience. From puzzles to shape sorters, watch your little ones grow and learn with toys that cater to their curiosity and developmental needs.",
    buttonText: "Buy now",
    placeholderBg: "bg-purple-200", 
    overlay: "bg-accent-secondary/80", 
  },
  {
    title: "Rediscover Classic Play",
    description: "Step into a world of imagination and timeless fun with our handcrafted wooden toys. Each piece is designed to spark joy and creativity, bringing the warmth of tradition to your child's playtime.",
    buttonText: "Shop now",
    placeholderBg: "bg-orange-100",
    overlay: "bg-yellow-800/40",
  },
  {
    title: "Empower Independent Learning",
    description: "Embrace the Montessori method with toys that encourage self-directed activity, hands-on learning, and collaborative play. Our carefully selected range supports your child's natural desire to learn.",
    buttonText: "Discover more",
    placeholderBg: "bg-green-100",
    overlay: "bg-green-800/40",
  },
];

const HeroCarousel = () => {
    const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

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
        <section className="w-full py-8 md:py-10">
            <div className="container">
                <Carousel
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    className="relative"
                    setApi={setApi}
                >
                    <CarouselContent className="-ml-4">
                       {carouselSlides.map((slide, index) => (
                           <CarouselItem key={index} className="pl-4 md:basis-full lg:basis-5/6">
                               <div
                                   className="relative flex items-center h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
                               >
                                    <div className={`absolute inset-0 ${slide.placeholderBg}`}></div>
                                    <div className={`absolute inset-0 ${slide.overlay}`}></div>
                                   <div className="relative text-left p-8 sm:p-12 md:p-16 text-white max-w-lg z-10">
                                       <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight -tracking-wider mb-4">
                                           {slide.title}
                                       </h1>
                                       <p className="text-hero-body mb-8 max-w-md">
                                           {slide.description}
                                       </p>
                                       <Button className="bg-white text-primary-text hover:bg-gray-100 font-medium rounded text-sm px-6 py-3 h-auto">
                                           {slide.buttonText}
                                       </Button>
                                   </div>
                               </div>
                           </CarouselItem>
                       ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex absolute left-[-1rem] top-1/2 -translate-y-1/2 bg-transparent text-primary-text/60 hover:text-primary-text text-5xl font-thin border-none h-12 w-12 items-center justify-center disabled:hidden">
                        &larr;
                    </CarouselPrevious>
                     <CarouselNext className="hidden md:flex absolute right-[-1rem] top-1/2 -translate-y-1/2 bg-transparent text-primary-text/60 hover:text-primary-text text-5xl font-thin border-none h-12 w-12 items-center justify-center disabled:hidden">
                        &rarr;
                    </CarouselNext>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${current === index ? 'bg-white' : 'bg-white/50'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default HeroCarousel;