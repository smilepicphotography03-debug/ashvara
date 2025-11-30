import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Get single category by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(id)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(category[0], { status: 200 });
    }

    // Get single category by slug
    if (slug) {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(category[0], { status: 200 });
    }

    // List categories with optional search and pagination
    let query = db.select().from(categories);

    if (search) {
      query = query.where(like(categories.name, `%${search}%`));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { name, slug, description, image } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Slug is required', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug.trim()))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const categoryData: any = {
      name: name.trim(),
      slug: slug.trim(),
      createdAt: new Date().toISOString(),
    };

    if (description !== undefined) {
      categoryData.description = description?.trim() || null;
    }

    if (image !== undefined) {
      categoryData.image = image?.trim() || null;
    }

    // Insert new category
    const newCategory = await db
      .insert(categories)
      .values(categoryData)
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const categoryId = parseInt(id);

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image } = body;

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (slug !== undefined) {
      if (slug.trim() === '') {
        return NextResponse.json(
          { error: 'Slug cannot be empty', code: 'INVALID_SLUG' },
          { status: 400 }
        );
      }

      // Check if new slug already exists (excluding current category)
      const slugExists = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug.trim()))
        .limit(1);

      if (slugExists.length > 0 && slugExists[0].id !== categoryId) {
        return NextResponse.json(
          { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
          { status: 400 }
        );
      }

      updateData.slug = slug.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (image !== undefined) {
      updateData.image = image?.trim() || null;
    }

    // If no fields to update, return current category
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingCategory[0], { status: 200 });
    }

    // Update category
    const updatedCategory = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory[0], { status: 200 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const categoryId = parseInt(id);

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete category
    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Category deleted successfully',
        category: deletedCategory[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}