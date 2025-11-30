import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, ArrowRight } from 'lucide-react';

const VisaIcon = () => (
  <svg className="rounded-sm" width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa">
    <rect width="38" height="24" rx="3" fill="#FFF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.68 15.655H12.333L10.977 8.337a.641.641 0 00-.62-.519H6.965a.48.48 0 00-.479.489l2.396 11.536h2.493l3.805-11.536.002.001a.48.48 0 00-.477-.53h-2.39a.525.525 0 00-.51.583l-.625 3.194zM24.73 9.471a2.38 2.38 0 00-2.091-1.28c-1.396 0-2.396 1.028-2.396 2.457 0 1.13.624 1.767 1.127 2.112.502.345.827.585.827.873 0 .428-.426.634-.928.634a1.85 1.85 0 01-1.334-.53l-.337-.487a.493.493 0 00-.65-.192l-1.42.846a.48.48 0 00-.18.675l.18.284c.676 1.052 1.94 1.614 3.376 1.614 1.546 0 2.547-1.029 2.547-2.52 0-1.205-.625-1.805-1.152-2.15-.452-.308-.752-.524-.752-.845 0-.285.351-.548.903-.548.978 0 1.252.393 1.34.62a.48.48 0 00.476.353h1.625a.48.48 0 00.47-.562l-.261-1.285zM30.41 15.655h2.115l-1.35-7.39h-1.889l-2.42 7.39h2.16l.375-1.23h2.385l.224 1.23zm-.6-2.52h-1.42l.7-3.837h.025l.7 3.837z" fill="#142688"/>
  </svg>
);

const MastercardIcon = () => (
  <svg className="rounded-sm" width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard">
    <rect width="38" height="24" rx="3" fill="#FFF"/>
    <circle cx="15" cy="12" r="7" fill="#EB001B"/>
    <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
    <path d="M20.522 12c0 2.92-1.556 5.518-3.913 6.917-1.1-3.692.13-7.859 3.913-9.834a7.003 7.003 0 010 2.917z" fill="#FF5F00"/>
  </svg>
);

const UpiIcon = () => (
  <div className="bg-white border border-gray-300 rounded-sm w-[38px] h-[24px] flex items-center justify-center" aria-label="UPI">
    <span className="font-bold text-[10px] text-[#2f3133]">UPI</span>
  </div>
);

const PaypalIcon = () => (
    <svg className="rounded-sm" width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PayPal">
    <rect width="38" height="24" rx="3" fill="#FFF"/>
    <path d="M12.92 10.744c0-1.2 1-2.181 2.45-2.181h4.032c3.468 0 5.617 1.83 4.968 5.437-.58 3.25-2.92 4.912-6.136 4.912h-1.393a.581.581 0 01-.58-.65l.775-4.757a.775.775 0 00-.775-.85H14.19a.775.775 0 01-.775-.809zm6.007.828h-1.86a.775.775 0 00-.775.83l-.7 4.31a.582.582 0 00.58.64h1.085c2.45 0 4.108-1.29 4.542-3.83.395-2.247-1.162-3.778-3.097-3.778zM19.83 8.563h-3.955c-1.55 0-2.325.85-2.578 2.055a.465.465 0 00.465.51h.31c.232 0 .465-.192.465-.43l.078-1.124a.465.465 0 01.465-.43h4.34c3.023 0 4.185 1.745 3.642 4.496-.465 2.56-2.48 4.095-5.27 4.095h-1.24a.465.465 0 00-.465.48l.698 4.286a.465.465 0 00.465.44h.775c.31 0 .465-.23.388-.51l-.697-4.286a.465.465 0 01.465-.48h.542c3.41 0 5.89-2.094 6.433-5.353.62-3.72-1.782-5.75-5.425-5.75z" fill="#253B80"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-secondary text-primary-text">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 pt-16 pb-12 lg:pt-20 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-border">
          
          <div className="lg:col-span-4">
            <h3 className="text-base font-semibold mb-5 text-primary-text">Subscribe to newsletter</h3>
            <form className="flex mb-6 max-w-sm">
              <div className="flex w-full items-center border border-input rounded-md overflow-hidden bg-background">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-grow p-2.5 pl-4 border-none focus:ring-0 outline-none text-sm text-secondary-text placeholder-muted-foreground bg-transparent"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="p-3 border-l text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="Subscribe to newsletter">
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/kuviyal.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-secondary-text hover:text-primary-text transition-colors duration-200"><Instagram size={22} /></a>
              <a href="https://www.facebook.com/kuviyal.in" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-secondary-text hover:text-primary-text transition-colors duration-200"><Facebook size={22} /></a>
              <a href="https://www.youtube.com/channel/kuviyal.in" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-secondary-text hover:text-primary-text transition-colors duration-200"><Youtube size={22} /></a>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold mb-5 text-primary-text">Quick links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search" className="text-secondary-text hover:text-primary-text hover:underline">Search</Link></li>
              <li><Link href="/policies/privacy-policy" className="text-secondary-text hover:text-primary-text hover:underline">Privacy Policy</Link></li>
              <li><Link href="/policies/refund-policy" className="text-secondary-text hover:text-primary-text hover:underline">Return and Refund Policy</Link></li>
              <li><Link href="/policies/shipping-policy" className="text-secondary-text hover:text-primary-text hover:underline">Shipping Policy</Link></li>
              <li><Link href="/policies/terms-of-service" className="text-secondary-text hover:text-primary-text hover:underline">Terms of Service</Link></li>
              <li><Link href="/pages/about-us" className="text-secondary-text hover:text-primary-text hover:underline">About Us</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-5">
             <p className="text-sm text-secondary-text leading-6 max-w-md">
              Discover Kuviyal: Your go-to for eco-friendly, educational toys! Ignite your child's imagination with our unique wooden and Montessori playthings.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left gap-6">
          <p className="text-xs text-muted-foreground">
            Copyright © 2025,{' '}
            <Link href="/" className="hover:underline">Kuviyal</Link>.{' '}
            <a href="https://www.shopify.com?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Powered by Shopify
            </a>
          </p>
          <div className="flex items-center space-x-2">
            <VisaIcon />
            <MastercardIcon />
            <UpiIcon />
            <PaypalIcon />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;