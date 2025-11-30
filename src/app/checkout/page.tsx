"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const router = useRouter();
  const { cart, isLoading: isCartLoading, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isSessionLoading && !session?.user) {
      router.push("/login?redirect=/checkout");
    }
  }, [session, isSessionLoading, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (!isCartLoading && cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/");
    }
  }, [cart, isCartLoading, router]);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.product?.salePrice || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          totalAmount: total,
          status: "pending",
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Create order items
      for (const item of cart) {
        await fetch("/api/order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
          },
          body: JSON.stringify({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product?.salePrice || item.product?.price || 0,
          }),
        });
      }

      // Clear cart
      await clearCart();

      toast.success("Order placed successfully!");
      router.push("/account");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSessionLoading || isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user || cart.length === 0) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-text mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span className="text-primary-text">Checkout</span>
        </nav>

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-semibold text-primary-text mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-primary-text mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="text-2xl font-semibold text-primary-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name || "Product"}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-primary-text truncate">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-xs text-secondary-text mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-text">
                          Rs. {((item.product?.salePrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Subtotal</span>
                    <span className="text-primary-text font-medium">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Shipping</span>
                    <span className="text-primary-text font-medium">
                      {shipping === 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                    <span className="text-primary-text">Total</span>
                    <span className="text-primary-text">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-opacity-90 text-base font-medium py-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-secondary-text text-center mt-4">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
