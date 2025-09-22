import { z } from 'zod';
export declare const schema: {
    readonly email: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
};
export declare const options: {
    readonly users: z.ZodObject<{
        fio: z.ZodOptional<z.ZodString>;
        displayName: z.ZodOptional<z.ZodString>;
        timezone: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        friend_id: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            email: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            push: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
            sms: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly items: z.ZodObject<{
        user_id: z.ZodString;
        mark_id: z.ZodString;
        route_id: z.ZodString;
        zone_id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
