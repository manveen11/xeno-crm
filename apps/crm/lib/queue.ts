import { Queue } from 'bullmq'
import { redis } from './redis'

export const sendCampaignQueue = new Queue('send-campaign', {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
})
