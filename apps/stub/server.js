const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const CRM_RECEIPT_URL = process.env.CRM_RECEIPT_URL || 'http://localhost:3000/api/receipt'

// Utility to delay execution
const delay = (ms) => new Promise(res => setTimeout(res, ms))
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

async function callbackToCRM(communicationId, status) {
  try {
    const res = await fetch(CRM_RECEIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ communicationId, status, timestamp: new Date() })
    })
    console.log(`[Stub] Sent ${status} callback for ${communicationId}. CRM responded: ${res.status}`)
  } catch (error) {
    console.error(`[Stub] Failed to reach CRM receipt webhook: ${error.message}`)
  }
}

app.post('/send', (req, res) => {
  const { communicationId, phone, message, channel } = req.body

  if (!communicationId) {
    return res.status(400).json({ error: 'communicationId is required' })
  }

  // Acknowledge immediately
  res.status(202).json({ accepted: true })

  console.log(`[Stub] Accepted job for ${communicationId} via ${channel}`)

  // Simulate delivery lifecycle asynchronously
  setTimeout(async () => {
    // 85% Delivered, 15% Failed
    const isDelivered = Math.random() < 0.85
    const finalStatus = isDelivered ? 'DELIVERED' : 'FAILED'
    
    await callbackToCRM(communicationId, finalStatus)

    if (finalStatus === 'DELIVERED') {
      // 55% chance to open
      await delay(randomBetween(2000, 8000))
      if (Math.random() < 0.55) {
        await callbackToCRM(communicationId, 'OPENED')

        // 35% chance to click if opened
        if (Math.random() < 0.35) {
          await delay(randomBetween(1000, 4000))
          await callbackToCRM(communicationId, 'CLICKED')
        }
      }
    }
  }, randomBetween(1000, 5000))
})

app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'xeno-channel-stub' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[Stub] Channel simulation service running on port ${PORT}`)
})
