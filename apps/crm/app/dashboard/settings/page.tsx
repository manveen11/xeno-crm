import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  let hasApiKey = false;
  let geminiModel = 'gemini-2.5-flash';

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { geminiApiKey: true, geminiModel: true }
    });

    if (user) {
      hasApiKey = !!user.geminiApiKey;
      if (user.geminiModel) {
        geminiModel = user.geminiModel;
      }
    }
  }

  return (
    <SettingsClient 
      initialHasApiKey={hasApiKey} 
      initialModel={geminiModel} 
    />
  );
}
