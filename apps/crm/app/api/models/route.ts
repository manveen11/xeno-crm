import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let apiKeyToUse = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    const body = await req.json().catch(() => ({}));

    if (body.apiKey) {
      apiKeyToUse = body.apiKey;
    } else if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { geminiApiKey: true },
      });
      if (user?.geminiApiKey) {
        const decryptedKey = decrypt(user.geminiApiKey);
        if (decryptedKey) {
          apiKeyToUse = decryptedKey;
        }
      }
    }

    if (!apiKeyToUse) {
      return new Response('No API key available', { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKeyToUse}`);
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Failed to fetch models: ${errorText}`, { status: response.status });
    }

    const data = await response.json();
    
    // Filter for valid gemini models that support generateContent
    const models = data.models
      .filter((m: any) => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'))
      .map((m: any) => ({
        id: m.name.replace('models/', ''),
        name: m.displayName,
        version: m.version,
      }));

    return new Response(JSON.stringify({ models }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
