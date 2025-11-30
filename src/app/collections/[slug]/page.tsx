"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";

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

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all products for now - in a real app, you'd filter by collection
        const response = await fetch("/api/products?limit=50");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
          // Initialize quantities
          const initialQuantities: { [key: number]: number } = {};
          data.forEach((p: Product) => {
            initialQuantities[p.id] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [slug]);

  const handleAddToCart = async (productId: number) => {
    const quantity = quantities[productId] || 1;
    await addToCart(productId, quantity);
    setQuantities(prev => ({ ...prev, [productId]: 1 }));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const getCollectionTitle = () => {
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        <div className="h-8 bg-secondary animate-pulse rounded w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-secondary animate-pulse rounded-lg" />
              <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
              <div className="h-4 bg-secondary animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-text mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span className="text-primary-text">{getCollectionTitle()}</span>
        </nav>

        {/* Collection Header */}
        <h1 className="text-3xl md:text-4xl font-semibold text-primary-text mb-2">
          {getCollectionTitle()}
        </h1>
        <p className="text-secondary-text mb-8">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary-text text-lg">No products found in this collection.</p>
            <a href="/" className="text-primary hover:underline mt-4 inline-block">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const displayPrice = product.salePrice || product.price;
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

              return (
                <div
                  key={product.id}
                  className="bg-card border border-border-divider rounded-lg p-4 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  <div className="relative mb-4 cursor-pointer" onClick={() => handleProductClick(product.id)}>
                    <div className="aspect-square relative bg-secondary rounded-md overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    {product.saveAmount && (
                      <div className="absolute top-2 left-2 text-xs font-medium text-[#FF5722]">
                        Save Rs. {product.saveAmount.toFixed(2)}
                      </div>
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <div className="absolute top-2 right-2 text-xs font-medium text-[#FF9800]">
                        Low stock
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-semibold text-primary-text">
                        Rs. {displayPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <s className="text-sm text-price-strike">Rs. {product.price.toFixed(2)}</s>
                      )}
                    </div>
                    <h3 
                      className="text-base font-medium text-primary-text mb-1 h-10 leading-tight overflow-hidden cursor-pointer hover:underline"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-secondary-text mb-4">{product.vendor}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="px-3 py-2 text-secondary-text hover:bg-secondary transition-colors rounded-l-md"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="flex-1 text-center font-medium text-sm text-primary-text">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="px-3 py-2 text-secondary-text hover:bg-secondary transition-colors rounded-r-md"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stockQuantity === 0}
                        className="w-full bg-primary text-primary-foreground text-sm font-medium py-2 px-4 rounded-md hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.stockQuantity === 0 ? "Out of stock" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
