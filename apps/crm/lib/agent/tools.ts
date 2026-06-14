import { tool, generateText, jsonSchema } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { Channel } from '@prisma/client';
import { sendCampaignQueue } from '@/lib/queue';
import { prisma } from '@/lib/prisma';

export const agentTools = {
  segment_customers: tool({
    description: 'Query the database to segment customers based on their spend, recency, order count, or tags.',
    parameters: z.object({
      spentGt: z.number().optional().describe('Total spend strictly greater than this amount'),
      spentLt: z.number().optional().describe('Total spend strictly less than this amount'),
      lastOrderDaysAgo: z.number().optional().describe('Customer has not ordered in this many days (e.g. 90 for dormant)'),
      minOrders: z.number().optional().describe('Minimum number of total orders'),
      tags: z.array(z.string()).optional().describe('Tags to filter by (e.g. ["vip", "churned", "new", "frequent"])')
    }),
    // @ts-ignore: AI SDK type overload bug
    execute: async (args: any) => {
      console.log('=== [STEP 1] EXECUTING SEGMENT_CUSTOMERS TOOL ===');
      console.log('Args received from Gemini:', JSON.stringify(args, null, 2));
      
      try {
        const { spentGt, spentLt, lastOrderDaysAgo, minOrders, tags } = args;
        const where: any = {};
        
        if (spentGt !== undefined) where.totalSpent = { ...where.totalSpent, gt: spentGt };
        if (spentLt !== undefined) where.totalSpent = { ...where.totalSpent, lt: spentLt };
        if (minOrders !== undefined) where.totalOrders = { ...where.totalOrders, gte: minOrders };
        if (tags && tags.length > 0) where.tags = { hasSome: tags };
        
        if (lastOrderDaysAgo !== undefined) {
          const date = new Date();
          date.setDate(date.getDate() - lastOrderDaysAgo);
          where.lastOrderAt = { lte: date };
        }

        console.log('=== [STEP 2] Built Prisma Where Clause ===', JSON.stringify(where, null, 2));

        console.log('=== [STEP 3] Running prisma.customer.count... ===');
        const count = await prisma.customer.count({ where });
        console.log(`=== [STEP 4] Count finished. Found: ${count} ===`);

        console.log('=== [STEP 5] Running prisma.customer.findMany... ===');
        const sample = await prisma.customer.findMany({
          where,
          take: 3,
          select: { name: true, totalSpent: true, lastOrderAt: true }
        });
        console.log(`=== [STEP 6] Sample fetched. Count: ${sample.length} ===`);

        const result = {
          matchCount: count,
          sampleCustomers: sample.map((c: any) => ({
            ...c,
            lastOrderAt: c.lastOrderAt ? c.lastOrderAt.toISOString() : null
          })),
          segmentRulesUsed: { spentGt, spentLt, lastOrderDaysAgo, minOrders, tags }
        };
        
        console.log('=== [STEP 7] Returning Result to Gemini ===', JSON.stringify(result, null, 2));
        return result;

      } catch (error: any) {
        console.error('=== [FATAL ERROR IN SEGMENT_CUSTOMERS] ===', error);
        return {
          error: "Database query failed",
          message: error.message || String(error)
        };
      }
    },

  }),

  draft_message: tool({
    description: 'Draft 3 personalized message variants for a campaign based on the target segment and channel.',
    parameters: z.object({
      segmentDescription: z.string().describe('Plain English description of who we are targeting (e.g. VIPs, churned users)'),
      channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'RCS']),
      tone: z.enum(['friendly', 'urgent', 'exclusive']).optional()
    }),
    // @ts-ignore: AI SDK type overload bug
    execute: async (args: any) => {
      const { segmentDescription, channel, tone } = args;
      const prompt = `Draft 3 distinct message variants for a ${channel} marketing campaign targeting: "${segmentDescription}". 
      Tone should be ${tone || 'friendly'}. 
      IMPORTANT: You MUST include the exact string "{{name}}" somewhere in every variant so we can interpolate the customer's real name later. 
      Keep them short and punchy, suitable for ${channel}. Do not include quotes around the variants.`;

      const generation = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
      });

      const variants = generation.text.split('\n')
        .filter(v => v.trim().length > 10)
        .slice(0, 3)
        .map(v => v.replace(/^[\d\.\-\*]+/, '').trim());

      return { variants };
    }
  }),

  create_campaign: tool({
    description: 'Create and fire the campaign. Only call this AFTER the user has explicitly confirmed the message variant and given the go-ahead.',
    parameters: z.object({
      name: z.string().optional().describe('A short, auto-generated name for the campaign. Can be omitted.'),
      segmentRules: z.any().describe('The EXACT JSON object of the segment rules returned by segment_customers (e.g. { tags: ["vip"] })'),
      messageTemplate: z.string().optional().describe('PREFERRED: The final message string to send. Must contain {{name}}. Use THIS field name, not "message" or "messageBody".'),
      messageBody: z.string().optional().describe('ALIAS for messageTemplate — accepted if messageTemplate is not provided'),
      message: z.string().optional().describe('ALIAS for messageTemplate — accepted if messageTemplate is not provided'),
      channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'RCS']).optional().describe('Delivery channel. Defaults to WHATSAPP.')
    }),
    // @ts-ignore: AI SDK type overload bug
    execute: async (args: any) => {
      console.log('=== [TOOL] create_campaign STARTED ===');
      console.log('Args received:', JSON.stringify(args, null, 2));

      try {
        // --- Normalize args: the AI sometimes uses alternate field names ---
        const segmentRules = args.segmentRules ?? args.segment_rules ?? args.rules ?? {};
        // Accept any of the field names the AI might use for the message
        const messageTemplate: string = args.messageTemplate ?? args.message ?? args.messageBody ?? args.messageContent ?? args.template ?? args.text ?? '';
        // Default campaign name if AI omits it
        const name: string = args.name ?? args.campaignName ?? `Campaign ${new Date().toLocaleDateString('en-IN')}`;
        // Default channel to WHATSAPP if AI omits it
        const VALID_CHANNELS = ['WHATSAPP', 'SMS', 'EMAIL', 'RCS'];
        const rawChannel: string = (args.channel ?? 'WHATSAPP').toUpperCase();
        const channel = VALID_CHANNELS.includes(rawChannel) ? rawChannel : 'WHATSAPP';

        console.log('[create_campaign] Normalized args:', { name, channel, segmentRules, messageTemplate: messageTemplate.slice(0, 60) });

        if (!messageTemplate) {
          console.error('[create_campaign] ERROR: messageTemplate is empty — cannot proceed.');
          return { success: false, error: 'messageTemplate is required but was not provided.' };
        }

        const campaign = await prisma.campaign.create({
          data: {
            name,
            segmentRules: segmentRules || {},
            message: messageTemplate,
            channel: channel as Channel,
            status: 'SENDING',
            stats: {
              create: { total: 0 }
            }
          }
        });
        console.log(`[create_campaign] ✅ Created campaign DB record: ${campaign.id}`);

        const where: any = {};
        if (segmentRules.spentGt !== undefined) where.totalSpent = { ...where.totalSpent, gt: segmentRules.spentGt };
        if (segmentRules.spentLt !== undefined) where.totalSpent = { ...where.totalSpent, lt: segmentRules.spentLt };
        if (segmentRules.minOrders !== undefined) where.totalOrders = { ...where.totalOrders, gte: segmentRules.minOrders };
        if (segmentRules.tags && segmentRules.tags.length > 0) where.tags = { hasSome: segmentRules.tags };
        if (segmentRules.lastOrderDaysAgo !== undefined) {
           const date = new Date();
           date.setDate(date.getDate() - segmentRules.lastOrderDaysAgo);
           where.lastOrderAt = { lte: date };
        }

        console.log(`[create_campaign] Querying customers with filters:`, JSON.stringify(where));
        const customers = await prisma.customer.findMany({ where });
        console.log(`[create_campaign] ✅ Found ${customers.length} target customers.`);

        if (customers.length === 0) {
          await prisma.campaign.update({ where: { id: campaign.id }, data: { status: 'SENT' } });
          console.log('[create_campaign] No customers matched — campaign marked SENT with 0 messages.');
          return { success: true, campaignId: campaign.id, totalMessagesQueued: 0 };
        }

        // Run all communication creates in parallel (not sequential) to avoid timeout
        console.log(`[create_campaign] Writing ${customers.length} communications to DB (parallel)...`);
        const comms = await Promise.all(
          customers.map((customer: any) => {
            const personalizedMessage = messageTemplate.replace(/\{\{name\}\}/gi, customer.name);
            return prisma.communication.create({
              data: {
                campaignId: campaign.id,
                customerId: customer.id,
                channel: channel as Channel,
                message: personalizedMessage,
                status: 'SENT'
              }
            }).then(comm => ({ comm, customer, personalizedMessage }));
          })
        );
        console.log(`[create_campaign] ✅ ${comms.length} communications written.`);

        // Queue all messages in parallel
        console.log(`[create_campaign] Pushing ${comms.length} jobs to Redis sendCampaignQueue...`);
        await Promise.all(
          comms.map(({ comm, customer, personalizedMessage }: any) =>
            sendCampaignQueue.add('send', {
              communicationId: comm.id,
              phone: customer.phone,
              message: personalizedMessage,
              channel
            })
          )
        );
        console.log(`[create_campaign] ✅ All jobs queued.`);

        const queued = comms.length;

        console.log(`[create_campaign] Updating campaign stats to ${queued} queued...`);
        await Promise.all([
          prisma.campaignStats.update({
            where: { campaignId: campaign.id },
            data: { total: queued, sent: queued }
          }),
          prisma.campaign.update({
            where: { id: campaign.id },
            data: { status: 'SENT' }
          })
        ]);

        console.log('=== [TOOL] create_campaign FINISHED ===');
        return {
          success: true,
          campaignId: campaign.id,
          totalMessagesQueued: queued
        };

      } catch (err: any) {
        console.error('=== [TOOL] create_campaign ERROR ===', err?.message ?? err);
        return {
          success: false,
          error: err?.message ?? 'Unknown error in create_campaign',
        };
      }

    }
  }),

  get_campaign_stats: tool({
    description: 'Get real-time delivery stats for a campaign. If the user says "recent", "latest", or "last" campaign, call this with no campaignId and it will automatically look up the most recent one.',
    parameters: z.object({
      campaignId: z.string().optional().describe('The campaign ID to check. OMIT this entirely if the user said "recent", "latest", or "last" — the tool will find it automatically.')
    }),
    // @ts-ignore: AI SDK type overload bug
    execute: async (args: any) => {
      let { campaignId } = args;

      // If no ID provided, look up the most recent campaign
      if (!campaignId) {
        const latest = await prisma.campaign.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, createdAt: true }
        });
        if (!latest) return { error: 'No campaigns found in the database.' };
        campaignId = latest.id;
        console.log(`[get_campaign_stats] No ID provided — using latest campaign: ${latest.name} (${campaignId})`);
      }

      const [stats, campaign] = await Promise.all([
        prisma.campaignStats.findUnique({ where: { campaignId } }),
        prisma.campaign.findUnique({ where: { id: campaignId }, select: { name: true, channel: true, status: true, createdAt: true } })
      ]);

      if (!stats) return { error: `No stats found for campaign ${campaignId}` };

      return {
        campaignName: campaign?.name,
        channel: campaign?.channel,
        status: campaign?.status,
        createdAt: campaign?.createdAt,
        ...stats
      };
    }
  })

};
