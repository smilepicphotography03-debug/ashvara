"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileMenuDrawerProps {
  children: React.ReactNode;
}

const ageRanges = [
  { href: "/collections/0-1-year-baby-toys", label: "0-1 Year" },
  { href: "/collections/1-2-years-baby-toys", label: "1-2 Years" },
  { href: "/collections/2-3-year-baby-toys", label: "2-3 Years" },
  { href: "/collections/3-year-baby-toys", label: "3-5 Year" },
  { href: "/collections/5-years", label: "5+ Year" },
];

const categories = [
  { href: "/collections/musical-toys", label: "Musical Toys" },
  { href: "/collections/puzzles", label: "Puzzles" },
  { href: "/collections/books", label: "Books" },
  { href: "/collections/flash-cards", label: "Flash Cards" },
  { href: "/collections/bags", label: "Bags" },
  { href: "/collections/lunch-boxes", label: "Lunch Boxes" },
  { href: "/collections/water-bottles", label: "Water Bottles" },
  { href: "/collections/arts-crafts", label: "Arts & Crafts" },
  { href: "/collections/sorting-stacking", label: "Sorting & Stacking" },
  { href: "/collections/montessori-toys", label: "Montessori Toys" },
];

const priceRanges = [
  { href: "/collections/under-99", label: "Under ₹99" },
  { href: "/collections/under-199", label: "Under ₹199" },
  { href: "/collections/under-499", label: "Under ₹499" },
  { href: "/collections/under-799", label: "Under ₹799" },
  { href: "/collections/under-999", label: "Under ₹999" },
  { href: "/collections/above-1000", label: "Above ₹1000" },
];

const directLinks = [
    { href: "/collections/best-sellers", label: "Best Sellers" },
    { href: "/collections/new-arrivals", label: "New Arrivals" },
    { href: "/collections/combo-toys", label: "Combo Toys" },
];

export default function MobileMenuDrawer({ children }: MobileMenuDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="bg-background w-[300px] p-0 flex flex-col">
        <div className="flex items-center justify-end p-4 border-b border-border">
          <SheetClose>
            <X className="h-6 w-6 text-foreground" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col text-lg font-medium">
            <Link
              href="/"
              className="px-6 py-4 text-primary border-b border-border"
            >
              Home
            </Link>

            <Accordion type="multiple" className="w-full">
              <AccordionItem value="age" className="border-b border-border px-6">
                <AccordionTrigger className="py-4 hover:no-underline">
                  Toys By Age
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="flex flex-col space-y-2 pl-4">
                    {ageRanges.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="category" className="border-b border-border px-6">
                <AccordionTrigger className="py-4 hover:no-underline">
                  Toys By Category
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="flex flex-col space-y-2 pl-4">
                    {categories.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price" className="border-b border-border px-6">
                <AccordionTrigger className="py-4 hover:no-underline">
                  Toys By Price
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="flex flex-col space-y-2 pl-4">
                    {priceRanges.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {directLinks.map((link) => (
                <Link key={link.label} href={link.href} className="px-6 py-4 border-b border-border">
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}