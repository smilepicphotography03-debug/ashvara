"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import SearchModal from "@/components/search-modal";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  LogOut,
  Package,
  Settings,
} from "lucide-react";

const toysByAge = [
  { href: "/collections/0-1-year-baby-toys", title: "0-1 Year" },
  { href: "/collections/1-2-years-baby-toys", title: "1-2 Years" },
  { href: "/collections/2-3-year-baby-toys", title: "2-3 Years" },
  { href: "/collections/3-year-baby-toys", title: "3-5 Year" },
  { href: "/collections/5-years", title: "5+ Year" },
];

const toysByCategory = [
  { href: "/collections/puzzles", title: "Puzzles" },
  { href: "/collections/musical-toys", title: "Musical Toys" },
  { href: "/collections/books", title: "Books" },
  { href: "/collections/flash-cards", title: "Flash Cards" },
  { href: "/collections/bags", title: "Bags" },
  { href: "/collections/lunch-boxes", title: "Lunch Boxes" },
  { href: "/collections/water-bottles", title: "Water Bottles" },
  { href: "/collections/arts-crafts", title: "Arts & Crafts" },
  { href: "/collections/non-wooden-products", title: "Non Wooden Products" },
  { href: "/collections/sorting-stacking", title: "Sorting & Stacking" },
  { href: "/collections/decor-items", title: "Decor Items" },
  { href: "/collections/gym", title: "Gym" },
  { href: "/collections/return-gifts", title: "Return Gifts" },
  { href: "/collections/miscellaneous", title: "Miscellaneous" },
  { href: "/collections/montessori-toys", title: "Montessori Toys" },
];

const toysByPrice = [
  { href: "/collections/under-99", title: "Under ₹99" },
  { href: "/collections/under-199", title: "Under ₹199" },
  { href: "/collections/under-499", title: "Under ₹499" },
  { href: "/collections/under-799", title: "Under ₹799" },
  { href: "/collections/under-999", title: "Under ₹999" },
  { href: "/collections/above-1000", title: "Above ₹1000" },
];

const navLinks = [
  { href: "/", title: "Home" },
  { title: "Toys By Age", items: toysByAge },
  { title: "Toys By Category", items: toysByCategory },
  { title: "Toys By Price", items: toysByPrice },
  { href: "/collections/best-sellers", title: "Best Sellers" },
  { href: "/collections/new-arrivals", title: "New Arrivals" },
  { href: "/collections/combo-toys", title: "Combo Toys" },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "text-nav-link block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {title}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const HeaderNavigation = () => {
  const [isSticky, setIsSticky] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const { cartCount, openCart } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background transition-shadow duration-300",
          isSticky ? "shadow-md border-border" : "border-transparent"
        )}
      >
        <div className="container flex h-[60px] items-center justify-between lg:h-20">
          {/* === Left: Desktop Logo / Mobile Hamburger === */}
          <div className="flex justify-start lg:w-1/4">
            <div className="hidden lg:block">
              <Link href="/">
                <h1 className="sr-only">Kuviyal</h1>
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/Logo_2_2-1.png"
                  alt="Kuviyal"
                  width={120}
                  height={120}
                  className="h-auto w-[120px]"
                  priority
                />
              </Link>
            </div>
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto pt-10 sm:w-[350px]">
                  <nav className="flex flex-col px-2">
                    <Accordion type="single" collapsible className="w-full">
                      {navLinks.map((link, index) =>
                        link.items ? (
                          <AccordionItem value={`item-${index}`} key={link.title}>
                            <AccordionTrigger className="px-2 py-3 text-sm font-medium hover:no-underline">
                              {link.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col space-y-1 pl-6">
                                {link.items.map((item) => (
                                  <Link
                                    key={item.title}
                                    href={item.href}
                                    className="block py-1.5 text-muted-foreground hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <Link
                            key={link.title}
                            href={link.href!}
                            className={cn(
                              "block border-b px-2 py-3 text-sm font-medium",
                              pathname === link.href ? "text-primary" : ""
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.title}
                          </Link>
                        )
                      )}
                    </Accordion>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* === Center: Desktop Nav / Mobile Logo === */}
          <div className="flex justify-center lg:w-2/4">
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.title}>
                      {link.items ? (
                        <>
                          <NavigationMenuTrigger className="text-nav-link bg-transparent tracking-[0.01em] hover:text-primary data-[active]:text-primary data-[state=open]:text-primary">
                            {link.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className={cn(
                              "grid gap-1 p-2",
                              link.title === "Toys By Category" ? "w-[500px] grid-cols-2" : "w-[200px]"
                            )}>
                              {link.items.map((item) => (
                                <ListItem key={item.title} title={item.title} href={item.href} />
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link href={link.href!} passHref legacyBehavior>
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-nav-link bg-transparent tracking-[0.01em] hover:text-primary", { 'text-primary font-semibold': pathname === link.href })}>
                            {link.title}
                          </NavigationMenuLink>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="lg:hidden">
              <Link href="/">
                <h1 className="sr-only">Kuviyal</h1>
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8f33a422-2dfa-40ba-8b8c-5c49b4332efa-kuviyal-in/assets/images/Logo_2_2-2.png"
                  alt="Kuviyal"
                  width={100}
                  height={100}
                  className="h-auto w-[100px]"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* === Right: Utility Icons === */}
          <div className="flex items-center justify-end space-x-0.5 lg:w-1/4 md:space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5 text-primary-text" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account Icon with Dropdown */}
            {!isPending && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-primary-text" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5 text-primary-text" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}

            {/* Cart Icon with Badge */}
            <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
              <ShoppingCart className="h-5 w-5 text-primary-text" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#E91E63] text-white text-xs flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart ({cartCount})</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default HeaderNavigation;