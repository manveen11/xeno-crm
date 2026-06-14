import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    select: { geminiApiKey: true, geminiModel: true },
  });

  return new Response(JSON.stringify({
    hasApiKey: !!user?.geminiApiKey,
    geminiModel: user?.geminiModel || 'gemini-2.5-flash',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { apiKey, model } = await req.json();
    const updateData: any = {};

    if (apiKey !== undefined) {
      if (apiKey === '') {
        updateData.geminiApiKey = null;
      } else {
        updateData.geminiApiKey = encrypt(apiKey);
      }
    }

    if (model !== undefined) {
      updateData.geminiModel = model;
    }

    await prisma.user.update({
      where: { email: session.user.email as string },
      data: updateData,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
