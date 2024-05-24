import { z } from "zod"

export const SignUpSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})