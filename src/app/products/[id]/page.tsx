import { Suspense } from "react";
import ProductDetailClient from "./product-detail-client";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient productId={id} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
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
