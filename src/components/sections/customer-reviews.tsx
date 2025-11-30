"use client";

import * as React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GoogleGLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.583 12.24C22.583 11.455 22.513 10.701 22.383 9.972H12V14.167H18.068C17.781 15.654 16.924 16.927 15.642 17.76V20.5H19.518C21.464 18.736 22.583 15.757 22.583 12.24Z" fill="#4285F4"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 23C15.148 23 17.824 21.942 19.518 20.5L15.642 17.76C14.593 18.455 13.298 18.885 12 18.885C9.288 18.885 6.915 17.07 6.064 14.619H2.073V17.48C3.801 20.732 7.61 23 12 23Z" fill="#34A853"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M6.064 14.619C5.836 13.924 5.717 13.181 5.717 12.417C5.717 11.652 5.836 10.91 6.064 10.214V7.354H2.073C1.411 8.649 1 10.454 1 12.417C1 14.379 1.411 16.184 2.073 17.48L6.064 14.619Z" fill="#FBBC05"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 5.94701C13.435 5.94701 14.697 6.42501 15.643 7.31001L19.599 3.65901C17.815 1.99601 15.148 1.00001 12 1.00001C7.61 1.00001 3.801 3.26801 2.073 7.35401L6.064 10.214C6.915 7.76301 9.288 5.94701 12 5.94701Z" fill="#EA4335"/>
  </svg>
);

const reviews = [
  {
    name: "udhaya manju",
    date: "November 4, 2025",
    rating: 5,
    text: "Received the product in good condition quality also good.worth for money",
    avatarInitial: "u",
    avatarBgColor: "bg-[#e67e22]",
  },
  {
    name: "arvinthpavi pavi",
    date: "October 16, 2025",
    rating: 5,
    text: "I ordered toy for my baby. I was too good in quality and safe to play worth for money, thank you..",
    avatarInitial: "a",
    avatarBgColor: "bg-[#2d8659]",
  },
  {
    name: "Priya Shankar",
    date: "October 14, 2025",
    rating: 5,
    text: "Good place to buy wooden toys.",
    avatarInitial: "P",
    avatarBgColor: "bg-[#7b1fa2]",
  },
  {
    name: "Keerthi Mani",
    date: "October 13, 2025",
    rating: 5,
    text: "Quality products",
    avatarInitial: "K",
    avatarBgColor: "bg-[#f1c40f]",
  },
];

const CustomerReviews = () => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
  
    React.useEffect(() => {
      if (!api) {
        return;
      }
      
      const onSelect = () => {
        setCurrent(api.selectedScrollSnap());
      };

      const onInit = () => {
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
      };

      api.on("select", onSelect);
      onInit();
      
      return () => {
        api.off("select", onSelect);
      };
    }, [api]);
  
    return (
      <section className="bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-16 items-start">
            
            <div className="lg:col-span-1 mb-12 lg:mb-0 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-xl font-semibold text-primary-text mb-1">Excellent</h3>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#ffb400]" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">Based on 383 Reviews</p>
              <div className="flex items-center gap-1.5">
                <GoogleGLogo />
                <span className="font-medium text-xl text-gray-500">Google</span>
              </div>
            </div>
  
            
            <div className="lg:col-span-3 relative">
               <Carousel 
                setApi={setApi} 
                opts={{ align: 'start' }}
                className="w-full"
               >
                <CarouselContent className="-ml-4">
                  {reviews.map((review, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2">
                      <div className="h-full"> 
                        <div className="bg-card rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-full ${review.avatarBgColor} flex items-center justify-center text-white text-xl font-medium uppercase shrink-0`}>
                                {review.avatarInitial}
                              </div>
                              <div>
                                <p className="font-semibold text-primary-text text-sm capitalize">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                             <GoogleGLogo />
                          </div>
                          <div className="flex mb-4">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-[#ffb400]" fill="currentColor" />
                            ))}
                          </div>
                          <p className="text-sm text-secondary-text leading-relaxed flex-grow">
                            {review.text}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-[-20px] xl:left-[-50px] w-10 h-10 bg-white shadow-md hidden md:flex"/>
                <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-[-20px] xl:right-[-50px] w-10 h-10 bg-white shadow-md hidden md:flex"/>
              </Carousel>
              <div className="flex justify-center items-center space-x-1.5 mt-8">
                {[...Array(count)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'bg-primary w-4' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
export default CustomerReviews;