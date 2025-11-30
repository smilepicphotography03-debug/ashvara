import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Puzzles',
            slug: 'puzzles',
            description: 'Educational puzzles for cognitive development',
            image: '',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Musical Toys',
            slug: 'musical-toys',
            description: 'Musical instruments and sound toys',
            image: '',
            createdAt: new Date('2024-01-11').toISOString(),
        },
        {
            name: 'Books',
            slug: 'books',
            description: "Children's books and educational reading materials",
            image: '',
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            name: 'Flash Cards',
            slug: 'flash-cards',
            description: 'Learning flash cards for early education',
            image: '',
            createdAt: new Date('2024-01-13').toISOString(),
        },
        {
            name: 'Bags',
            slug: 'bags',
            description: 'School bags and backpacks for kids',
            image: '',
            createdAt: new Date('2024-01-14').toISOString(),
        },
        {
            name: 'Sorting & Stacking',
            slug: 'sorting-stacking',
            description: 'Toys for learning shapes, colors, and coordination',
            image: '',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Montessori Toys',
            slug: 'montessori-toys',
            description: 'Montessori-inspired educational toys',
            image: '',
            createdAt: new Date('2024-01-16').toISOString(),
        },
        {
            name: 'Arts & Crafts',
            slug: 'arts-crafts',
            description: 'Creative art supplies and craft kits',
            image: '',
            createdAt: new Date('2024-01-17').toISOString(),
        },
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});