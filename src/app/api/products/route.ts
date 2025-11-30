import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, lte, like, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single product by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, parseInt(id)))
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json(
          { error: 'Product not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(product[0], { status: 200 });
    }

    // List products with filters
    const categoryId = searchParams.get('category_id');
    const ageRange = searchParams.get('age_range');
    const priceMax = searchParams.get('price_max');
    const search = searchParams.get('search') || searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    let query = db.select().from(products);
    const conditions = [];

    // Filter by category
    if (categoryId) {
      const categoryIdInt = parseInt(categoryId);
      if (!isNaN(categoryIdInt)) {
        conditions.push(eq(products.categoryId, categoryIdInt));
      }
    }

    // Filter by age range
    if (ageRange) {
      conditions.push(eq(products.ageRange, ageRange));
    }

    // Filter by max price
    if (priceMax) {
      const maxPrice = parseFloat(priceMax);
      if (!isNaN(maxPrice)) {
        conditions.push(lte(products.price, maxPrice));
      }
    }

    // Search in name and description
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, salePrice, images, categoryId, ageRange, stockQuantity, vendor, isCombo, saveAmount } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Product name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { error: 'Product price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Product description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    // Validate price is positive
    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const insertData = {
      name: name.trim(),
      description: description.trim(),
      price: priceFloat,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      images: images || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      ageRange: ageRange || null,
      stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : 0,
      vendor: vendor || 'Kuviyal',
      isCombo: isCombo !== undefined ? Boolean(isCombo) : false,
      saveAmount: saveAmount ? parseFloat(saveAmount) : null,
      createdAt: new Date().toISOString(),
    };

    const newProduct = await db
      .insert(products)
      .values(insertData)
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    const productId = parseInt(id);

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, salePrice, images, categoryId, ageRange, stockQuantity, vendor, isCombo, saveAmount } = body;

    // Validate price if provided
    if (price !== undefined) {
      const priceFloat = parseFloat(price);
      if (isNaN(priceFloat) || priceFloat <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (images !== undefined) updateData.images = images;
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId) : null;
    if (ageRange !== undefined) updateData.ageRange = ageRange;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (vendor !== undefined) updateData.vendor = vendor;
    if (isCombo !== undefined) updateData.isCombo = Boolean(isCombo);
    if (saveAmount !== undefined) updateData.saveAmount = saveAmount ? parseFloat(saveAmount) : null;

    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(updatedProduct[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(
      {
        message: 'Product deleted successfully',
        product: deletedProduct[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}