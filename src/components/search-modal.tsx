"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[] | null;
  vendor: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
      setResults([]);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top duration-300">
        <div className="container mx-auto px-5 md:px-10 lg:px-15 pt-4 pb-8">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="text"
                placeholder="Search for toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              {isSearching && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="p-8 text-center text-secondary-text">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start typing to search for products</p>
                </div>
              ) : isSearching ? (
                <div className="p-8 text-center text-secondary-text">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                  <p>Searching...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center text-secondary-text">
                  <p>No products found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {results.map((product) => {
                    const displayPrice = product.salePrice || product.price;
                    const hasDiscount = product.salePrice && product.salePrice < product.price;
                    const primaryImage = product.images?.[0];

                    return (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full p-4 flex gap-4 hover:bg-secondary transition-colors text-left"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-primary-text truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-secondary-text mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-sm font-semibold text-primary-text">
                              Rs. {displayPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-price-strike line-through">
                                Rs. {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="p-3 border-t border-border text-center text-xs text-secondary-text">
                Showing {results.length} result{results.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
