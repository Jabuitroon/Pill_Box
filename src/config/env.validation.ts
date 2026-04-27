import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS is required.'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required.'),
  ADMIN_REGISTRATION_KEY: z
    .string()
    .min(1, 'ADMIN_REGISTRATION_KEY is required.')
})

export type Env = z.infer<typeof envSchema>

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    throw new Error('Invalid environment variables')
  }

  return result.data
}
