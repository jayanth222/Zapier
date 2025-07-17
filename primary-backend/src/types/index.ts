import { email, z } from 'zod'

export const SignUpSchema = z.object({
    email: z.email(),
    name: z.string().min(5),
    password: z.string().min(8)
})

export const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const ZapCreateSchema = z.object({
    name: z.string(),
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availabelActionId: z.string(),
        actionMetadata: z.any().optional()
    }))
})