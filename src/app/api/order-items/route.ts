import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orderItems, products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    // Validate order_id parameter
    if (!orderId) {
      return NextResponse.json(
        { 
          error: 'order_id query parameter is required',
          code: 'MISSING_ORDER_ID' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(orderId))) {
      return NextResponse.json(
        { 
          error: 'order_id must be a valid integer',
          code: 'INVALID_ORDER_ID' 
        },
        { status: 400 }
      );
    }

    // Fetch order items with product details using join
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        createdAt: orderItems.createdAt,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          salePrice: products.salePrice,
          images: products.images,
          categoryId: products.categoryId,
          ageRange: products.ageRange,
          stockQuantity: products.stockQuantity,
          vendor: products.vendor,
          isCombo: products.isCombo,
          saveAmount: products.saveAmount,
          createdAt: products.createdAt,
        }
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, parseInt(orderId)));

    return NextResponse.json(items, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}