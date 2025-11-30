"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  createdAt: string;
  product: {
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
    createdAt: string;
  } | null;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const userId = session?.user?.id || `guest-${typeof window !== 'undefined' ? localStorage.getItem('guestId') || '' : ''}`;

  // Generate guest ID if not logged in
  useEffect(() => {
    if (!session?.user && typeof window !== 'undefined') {
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestId', guestId);
      }
    }
  }, [session]);

  const fetchCart = useCallback(async () => {
    if (!userId || userId === 'guest-') return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isSessionLoading && userId && userId !== 'guest-') {
      fetchCart();
    } else if (!isSessionLoading) {
      setIsLoading(false);
    }
  }, [fetchCart, isSessionLoading, userId]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: number, quantity: number) => {
    if (!userId || userId === 'guest-') {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
        toast.success("Added to cart!");
        openCart();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart();
        if (quantity === 0) {
          toast.success("Item removed from cart");
        }
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
      });

      if (response.ok) {
        await fetchCart();
        toast.success("Removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!userId || userId === 'guest-') return;

    try {
      const response = await fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
      });

      if (response.ok) {
        setCart([]);
        toast.success("Cart cleared");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const refreshCart = fetchCart;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
