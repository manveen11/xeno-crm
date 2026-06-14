import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();

    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return NextResponse.json({ error: 'Error parsing CSV file', details: result.errors }, { status: 400 });
    }

    const rows = result.data as any[];
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    // Since 'email' is not marked @unique in the schema, 
    // we manually fetch existing emails to skip duplicates.
    const existingCustomers = await prisma.customer.findMany({
      select: { email: true },
      where: { email: { not: null } }
    });
    
    const existingEmails = new Set(existingCustomers.map(c => c.email));

    const validCustomers = [];
    
    for (const row of rows) {
      if (!row.name) continue; // Skip rows without name

      // Skip duplicate emails if provided
      if (row.email && existingEmails.has(row.email)) {
        continue;
      }
      
      // Parse tags
      let parsedTags: string[] = [];
      if (row.tags) {
        parsedTags = row.tags.split('|').map((t: string) => t.trim()).filter(Boolean);
      }

      validCustomers.push({
        name: row.name,
        email: row.email || null,
        phone: row.phone || null,
        tags: parsedTags,
        totalOrders: row.totalOrders ? parseInt(row.totalOrders, 10) : 0,
        totalSpent: row.totalSpent ? parseFloat(row.totalSpent) : 0,
        lastOrderAt: row.lastOrderAt ? new Date(row.lastOrderAt) : null,
      });
      
      // Add to set to prevent duplicates within the CSV itself
      if (row.email) {
        existingEmails.add(row.email);
      }
    }

    if (validCustomers.length === 0) {
      return NextResponse.json({ count: 0, message: 'No new unique customers found to import' });
    }

    const created = await prisma.customer.createMany({
      data: validCustomers,
    });

    return NextResponse.json({ success: true, count: created.count });

  } catch (error) {
    console.error('CSV Import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
