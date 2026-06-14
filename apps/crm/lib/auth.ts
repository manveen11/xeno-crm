import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_client_secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@xeno.ai" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          // Auto-seed the demo user if it doesn't exist and they try to login
          if (credentials.email === "demo@xeno.ai" && credentials.password === "password123") {
            const hashedPassword = await bcrypt.hash("password123", 10)
            const newUser = await prisma.user.create({
              data: {
                name: "Demo User",
                email: "demo@xeno.ai",
                password: hashedPassword,
              }
            })
            return newUser
          }
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub
      }
      return session
    },
  }
}
