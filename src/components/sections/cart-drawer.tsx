"use client";

import React from 'react';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';

// Replicating the original SVG for the empty cart icon to maintain pixel-perfect accuracy.
const EmptyCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M43.208 40.062a2.125 2.125 0 0 1-2.091 1.771H9.883a2.125 2.125 0 0 1-2.092-2.479l2.766-17a2.125 2.125 0 0 1 2.092-1.77h24.698a2.125 2.125 0 0 1 2.092 1.77l2.768 17a2.124 2.124 0 0 1 0 .708Z" stroke="currentColor" strokeWidth="2.5"></path>
    <path d="M14.773 22.833V15.75c0-5.833 3.542-10.625 9.375-10.625 3.125 0 5.86 1.719 7.735 4.349" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="m36.22 17.875 1.583 10.125M25.5 22.833V18.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
  </svg>
);

const EmptyCartView: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-5">
    <EmptyCartIcon className="text-gray-500 mb-6" />
    <span id="cart-drawer-heading" className="text-xl font-medium text-white block mb-6">Your cart is empty</span>
    <Button 
      onClick={onClose}
      className="w-full bg-primary hover:bg-[#d81b60] text-white"
      asChild
    >
      <Link href="/">
        Continue Shopping
      </Link>
    </Button>
    <span className="mt-8 text-sm block text-gray-400">Have an account?</span>
    <p className="text-sm text-gray-400 block mt-1">
      <Link href="/login" className="underline text-white hover:text-gray-300">
        Log in
      </Link>
      {' '}to check out faster.
    </p>
  </div>
);

const PopulatedCartView: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product?.salePrice ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    await updateQuantity(cartItemId, newQuantity);
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 flex-grow overflow-y-auto'>
        <h2 id="cart-drawer-heading" className="text-lg font-semibold mb-4 text-white">Your Cart</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-800 p-3 rounded-lg">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-white rounded overflow-hidden">
                  {item.product?.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                    {item.product?.name || 'Unknown Product'}
                  </h3>
                  <p className="text-gray-400 text-xs mb-2">{item.product?.vendor}</p>
                  
                  <div className="flex items-center justify-between">
                    {/* Price */}
                    <div className="text-white font-semibold">
                      ₹{((item.product?.salePrice ?? item.product?.price ?? 0) * item.quantity).toFixed(2)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded"
                        disabled={isLoading}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded"
                        disabled={isLoading}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 text-xs mt-2"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Subtotal and Checkout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-between mb-4 text-white">
          <span className="text-lg">Subtotal</span>
          <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-[#d81b60] text-white"
          asChild
        >
          <Link href="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Taxes and shipping calculated at checkout
        </p>
      </div>
    </div>
  );
};

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#2C2C2C] shadow-lg transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
      >
        <div className="relative flex flex-col h-full">
          <button
            onClick={closeCart}
            className="absolute top-4 right-4 text-white p-1 z-10 hover:opacity-80 transition-opacity"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? <EmptyCartView onClose={closeCart} /> : <PopulatedCartView />}
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;