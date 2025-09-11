import { z } from 'zod';
export declare const schema: {
    readonly email: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
    readonly optionsProfile: z.ZodObject<{
        theme: z.ZodEnum<{
            dark: "dark";
            light: "light";
        }>;
        itemsPerPage: z.ZodNumber;
        welcomeText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
