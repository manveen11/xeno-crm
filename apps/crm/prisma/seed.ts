import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clean up existing data
  await prisma.communication.deleteMany()
  await prisma.campaignStats.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()

  // Generate 500 Customers
  const customersData = []
  
  for (let i = 1; i <= 500; i++) {
    let customerTags = []
    let totalOrders = 0
    let totalSpent = 0
    let lastOrderAt = null

    // Create realistic segments based on build_spec.md
    if (i <= 100) {
      // 100 VIP (spent > ₹5000, ordered last 30 days)
      customerTags = ['vip', 'frequent']
      totalOrders = Math.floor(Math.random() * 10) + 5
      totalSpent = 5500 + Math.random() * 10000
      lastOrderAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    } else if (i <= 250) {
      // 150 at-risk (spent > ₹2000, no order 45-90 days)
      customerTags = ['sale-buyer']
      totalOrders = Math.floor(Math.random() * 5) + 2
      totalSpent = 2500 + Math.random() * 3000
      lastOrderAt = new Date(Date.now() - (45 + Math.random() * 45) * 24 * 60 * 60 * 1000)
    } else if (i <= 350) {
      // 100 churned (no order > 90 days)
      customerTags = ['churned']
      totalOrders = Math.floor(Math.random() * 3) + 1
      totalSpent = 500 + Math.random() * 2000
      lastOrderAt = new Date(Date.now() - (95 + Math.random() * 200) * 24 * 60 * 60 * 1000)
    } else {
      // 150 new (< 3 orders)
      customerTags = ['new']
      totalOrders = Math.floor(Math.random() * 2) + 1
      totalSpent = 1500 + Math.random() * 1500
      lastOrderAt = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
    }

    customersData.push({
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `+1555${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}`,
      tags: customerTags,
      totalOrders,
      totalSpent,
      lastOrderAt
    })
  }

  await prisma.customer.createMany({ data: customersData })
  console.log('Created 500 mock customers.')
  console.log('Database seeded successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
