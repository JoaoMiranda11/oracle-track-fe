import { jwtDecode } from "jwt-decode";
import { z } from "zod";

const validateJwt = z.object({
    _id: z.string(),
    email: z.string().email(),
    exp: z.number(),
    iat: z.number(),
    role: z.string(),
    status: z.string()
})

export function decodeJwt(jwt: string): UserJWT | null {
    const decoded = jwtDecode<UserJWT>(jwt);
    const validator = validateJwt.safeParse(decoded);
    if (validator.error) return null
    return validator.data;
}