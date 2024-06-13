import { z } from 'zod';

export const verifySchema = z.object({
    code: z.string().length(7, 'Verification code must be 6 digits'),
});
