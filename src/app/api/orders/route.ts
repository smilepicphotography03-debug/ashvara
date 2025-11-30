import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, cartItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single order by ID with order items
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json(
          { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
          { status: 404 }
        );
      }

      // Get order items for this order
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, parseInt(id)));

      return NextResponse.json({
        ...order[0],
        items,
      });
    }

    // Orders by user ID
    if (userId) {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(userOrders);
    }

    // Neither id nor user_id provided
    return NextResponse.json(
      {
        error: 'Either id or user_id parameter is required',
        code: 'MISSING_REQUIRED_PARAMETER',
      },
      { status: 400 }
    );
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
    const { userId, totalAmount, shippingAddress, items, status, paymentStatus } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!totalAmount || typeof totalAmount !== 'number') {
      return NextResponse.json(
        { error: 'Valid totalAmount is required', code: 'MISSING_TOTAL_AMOUNT' },
        { status: 400 }
      );
    }

    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim() === '') {
      return NextResponse.json(
        { error: 'shippingAddress is required', code: 'MISSING_SHIPPING_ADDRESS' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'items array is required and cannot be empty', code: 'MISSING_ITEMS' },
        { status: 400 }
      );
    }

    // Validate each item in the items array
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have a valid productId', code: 'INVALID_ITEM_PRODUCT_ID' },
          { status: 400 }
        );
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a valid quantity greater than 0', code: 'INVALID_ITEM_QUANTITY' },
          { status: 400 }
        );
      }
      if (!item.price || typeof item.price !== 'number' || item.price < 0) {
        return NextResponse.json(
          { error: 'Each item must have a valid price', code: 'INVALID_ITEM_PRICE' },
          { status: 400 }
        );
      }
    }

    const createdAt = new Date().toISOString();

    // Insert order
    const newOrder = await db
      .insert(orders)
      .values({
        userId: userId.trim(),
        totalAmount,
        shippingAddress: shippingAddress.trim(),
        status: status || 'pending',
        paymentStatus: paymentStatus || 'pending',
        createdAt,
      })
      .returning();

    if (newOrder.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create order', code: 'ORDER_CREATION_FAILED' },
        { status: 500 }
      );
    }

    const orderId = newOrder[0].id;

    // Insert order items
    const orderItemsToInsert = items.map((item: any) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      createdAt,
    }));

    const createdOrderItems = await db
      .insert(orderItems)
      .values(orderItemsToInsert)
      .returning();

    // Optionally clear user's cart
    try {
      await db.delete(cartItems).where(eq(cartItems.userId, userId.trim()));
    } catch (cartError) {
      console.error('Error clearing cart:', cartError);
      // Don't fail the order creation if cart clearing fails
    }

    return NextResponse.json(
      {
        ...newOrder[0],
        items: createdOrderItems,
      },
      { status: 201 }
    );
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus, shippingAddress } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (status !== undefined) {
      if (typeof status !== 'string' || status.trim() === '') {
        return NextResponse.json(
          { error: 'Status must be a non-empty string', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      updates.status = status.trim();
    }

    if (paymentStatus !== undefined) {
      if (typeof paymentStatus !== 'string' || paymentStatus.trim() === '') {
        return NextResponse.json(
          { error: 'Payment status must be a non-empty string', code: 'INVALID_PAYMENT_STATUS' },
          { status: 400 }
        );
      }
      updates.paymentStatus = paymentStatus.trim();
    }

    if (shippingAddress !== undefined) {
      if (typeof shippingAddress !== 'string' || shippingAddress.trim() === '') {
        return NextResponse.json(
          { error: 'Shipping address must be a non-empty string', code: 'INVALID_SHIPPING_ADDRESS' },
          { status: 400 }
        );
      }
      updates.shippingAddress = shippingAddress.trim();
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update order', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}