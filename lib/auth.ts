import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { prisma } from "./prisma"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRY = "7d"

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email, password },
    select: { id: true, email: true, name: true, password: true },
  })
  console.log(user, "user..")
  if (!user) return null

  // const passwordValid = await compare(password, user.password)
  // console.log(passwordValid, "passwordValid..")
  // if (!passwordValid) return null

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export function generateToken(userId: string) {
  return sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string) {
  try {
    const decoded = verify(token, JWT_SECRET)
    return decoded as { sub: string }
  } catch (error) {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    select: { id: true, email: true, name: true },
  })

  return user
}

export async function getAuthUser() {
  const token = cookies().get("token")?.value
  if (!token) return null

  return getUserFromToken(token)
}

export async function hashPassword(password: string) {
  return hash(password, 10)
}

