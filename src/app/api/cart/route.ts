import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cartItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    // Get cart items for the user
    const userCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));

    // If cart is empty, return empty array
    if (userCartItems.length === 0) {
      return NextResponse.json([]);
    }

    // Get product details for each cart item
    const cartWithProducts = await Promise.all(
      userCartItems.map(async (item) => {
        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId!))
          .limit(1);

        return {
          ...item,
          product: product[0] || null,
        };
      })
    );

    return NextResponse.json(cartWithProducts);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { 
          error: 'Product ID is required',
          code: 'MISSING_PRODUCT_ID'
        },
        { status: 400 }
      );
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { 
          error: 'Quantity must be a positive integer',
          code: 'INVALID_QUANTITY'
        },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update existing cart item quantity
      const newQuantity = existingItem[0].quantity + quantity;
      const updated = await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Insert new cart item
      const newCartItem = await db
        .insert(cartItems)
        .values({
          userId: userId.trim(),
          productId,
          quantity,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return NextResponse.json(newCartItem[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid cart item ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    // Validation
    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { 
          error: 'Quantity is required',
          code: 'MISSING_QUANTITY'
        },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { 
          error: 'Quantity must be a non-negative integer',
          code: 'INVALID_QUANTITY'
        },
        { status: 400 }
      );
    }

    // Check if cart item exists
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .limit(1);

    if (existingItem.length === 0) {
      return NextResponse.json(
        { 
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // If quantity is 0, delete the cart item
    if (quantity === 0) {
      const deleted = await db
        .delete(cartItems)
        .where(eq(cartItems.id, parseInt(id)))
        .returning();

      return NextResponse.json({
        message: 'Cart item removed successfully',
        item: deleted[0],
      });
    }

    // Update cart item quantity
    const updated = await db
      .update(cartItems)
      .set({
        quantity,
      })
      .where(eq(cartItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!id && !userId) {
      return NextResponse.json(
        { 
          error: 'Either cart item ID or user ID is required',
          code: 'MISSING_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // Delete specific cart item by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid cart item ID is required',
            code: 'INVALID_ID'
          },
          { status: 400 }
        );
      }

      // Check if cart item exists
      const existingItem = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.id, parseInt(id)))
        .limit(1);

      if (existingItem.length === 0) {
        return NextResponse.json(
          { 
            error: 'Cart item not found',
            code: 'CART_ITEM_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      const deleted = await db
        .delete(cartItems)
        .where(eq(cartItems.id, parseInt(id)))
        .returning();

      return NextResponse.json({
        message: 'Cart item deleted successfully',
        item: deleted[0],
      });
    }

    // Clear entire cart for user
    if (userId) {
      const deleted = await db
        .delete(cartItems)
        .where(eq(cartItems.userId, userId))
        .returning();

      return NextResponse.json({
        message: 'Cart cleared successfully',
        deletedCount: deleted.length,
      });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}