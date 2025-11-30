"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[] | null;
  categoryId: number | null;
  ageRange: string | null;
  stockQuantity: number;
  vendor: string;
  isCombo: boolean;
  saveAmount: number | null;
}

export default function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products?id=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast.error("Product not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-secondary animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary animate-pulse rounded w-3/4" />
            <div className="h-6 bg-secondary animate-pulse rounded w-1/4" />
            <div className="h-24 bg-secondary animate-pulse rounded" />
            <div className="h-12 bg-secondary animate-pulse rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-text mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span className="text-primary-text">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square relative bg-secondary rounded-lg overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">No Image Available</span>
                </div>
              )}
            </div>
            
            {product.saveAmount && (
              <div className="absolute top-4 left-4 bg-[#FF5722] text-white px-3 py-1 rounded-md text-sm font-medium">
                Save Rs. {product.saveAmount.toFixed(2)}
              </div>
            )}
            
            {product.stockQuantity < 10 && product.stockQuantity > 0 && (
              <div className="absolute top-4 right-4 bg-[#FF9800] text-white px-3 py-1 rounded-md text-sm font-medium">
                Low stock
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-semibold text-primary-text mb-2">
              {product.name}
            </h1>
            
            <p className="text-sm text-secondary-text mb-4">{product.vendor}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold text-primary-text">
                Rs. {displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-price-strike line-through">
                    Rs. {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-[#FF5722]">
                    Save Rs. {(product.price - displayPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary-text mb-2">Description</h3>
              <p className="text-secondary-text leading-relaxed">{product.description}</p>
            </div>

            {/* Product Info */}
            <div className="space-y-2 mb-6 text-sm">
              {product.ageRange && (
                <div className="flex">
                  <span className="text-secondary-text w-32">Age Range:</span>
                  <span className="text-primary-text font-medium">{product.ageRange}</span>
                </div>
              )}
              {product.isCombo && (
                <div className="flex">
                  <span className="text-secondary-text w-32">Type:</span>
                  <span className="text-primary-text font-medium">Combo Pack</span>
                </div>
              )}
              <div className="flex">
                <span className="text-secondary-text w-32">Stock:</span>
                <span className={`font-medium ${product.stockQuantity > 0 ? 'text-[#4CAF50]' : 'text-destructive'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-primary-text mb-2 block">Quantity</label>
              <div className="flex items-center border border-input rounded-md w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-secondary-text hover:bg-secondary transition-colors"
                  disabled={product.stockQuantity === 0}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center text-primary-text font-medium bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="px-4 py-3 text-secondary-text hover:bg-secondary transition-colors"
                  disabled={product.stockQuantity === 0}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || product.stockQuantity === 0}
              size="lg"
              className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-opacity-90 text-base font-medium py-6 px-12 rounded-md transition-all disabled:opacity-50"
            >
              <ShoppingCart className="mr-2" size={20} />
              {isAdding ? "Adding to cart..." : product.stockQuantity === 0 ? "Out of stock" : "Add to cart"}
            </Button>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="space-y-3 text-sm text-secondary-text">
                <p>✓ Free shipping for orders above ₹2000</p>
                <p>✓ Minimum order value ₹200</p>
                <p>✓ Opening video is must for any claims</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
