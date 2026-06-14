import { NextResponse } from 'next/server';
import { CommStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { communicationId, status } = body;

    if (!communicationId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure status is a valid CommStatus enum
    const validStatuses: Record<string, CommStatus> = {
      'DELIVERED': 'DELIVERED',
      'FAILED': 'FAILED',
      'OPENED': 'OPENED',
      'CLICKED': 'CLICKED'
    };

    const nextStatus = validStatuses[status];
    if (!nextStatus) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 1. Update the individual communication record
    const updatedComm = await prisma.communication.update({
      where: { id: communicationId },
      data: { status: nextStatus }
    });

    // 2. Increment the aggregate campaign stats
    const statField = nextStatus.toLowerCase(); // 'delivered', 'failed', 'opened', 'clicked'
    
    await prisma.campaignStats.update({
      where: { campaignId: updatedComm.campaignId },
      data: {
        [statField]: { increment: 1 }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process receipt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
