import "dotenv/config"
import { Worker } from 'bullmq'
import { redis } from '../lib/redis'

const worker = new Worker('send-campaign', async (job) => {
  console.log(`[Worker] Processing job ${job.id} for communication ${job.data.communicationId}`)
  
  try {
    const stubUrl = process.env.CHANNEL_STUB_URL || 'http://localhost:3001'
    
    // Simulate real network delay to slow down Redis processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await fetch(`${stubUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(job.data)
    })

    if (!response.ok) {
      throw new Error(`Stub returned status ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Worker] Job ${job.id} accepted by stub:`, data)
  } catch (error) {
    console.error(`[Worker] Failed to send job ${job.id} to stub:`, error)
    throw error // Let BullMQ handle retry with exponential backoff
  }
}, { 
  connection: redis as any,
  concurrency: 5,
  // Save Upstash Redis free quota by polling less frequently when idle
  drainDelay: 10000,        // Wait 10s before checking an empty queue again
  stalledInterval: 300000,  // Only check for stalled jobs every 5 mins
  lockDuration: 300000      // Keep lock for 5 mins
})

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed successfully!`)
})

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed after all retries:`, err.message)
})

console.log('[Worker] Campaign worker started and listening for jobs on "send-campaign" queue...')
