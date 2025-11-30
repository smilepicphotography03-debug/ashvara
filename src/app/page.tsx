"use client";

import * as React from "react";
import AnnouncementBar from "@/components/sections/announcement-bar";
import HeaderNavigation from "@/components/sections/header-navigation";
import HeroCarousel from "@/components/sections/hero-carousel";
import ShopByAge from "@/components/sections/shop-by-age";
import ShopByCategory from "@/components/sections/shop-by-category";
import ShopByPrice from "@/components/sections/shop-by-price";
import NewCollection from "@/components/sections/new-collection";
import ComboToys from "@/components/sections/combo-toys";
import CustomerReviews from "@/components/sections/customer-reviews";
import Footer from "@/components/sections/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <HeaderNavigation />
      
      <main className="flex-grow">
        <HeroCarousel />
        <ShopByAge />
        <ShopByCategory />
        <ShopByPrice />
        <NewCollection />
        <ComboToys />
        <CustomerReviews />
      </main>

      <Footer />
    </div>
  );
}