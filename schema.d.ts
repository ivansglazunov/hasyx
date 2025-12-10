import { z } from 'zod';
export declare const schema: {
    readonly email: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
};
export declare const _brainEnything: {
    brain: z.ZodString;
    brain_string: z.ZodString;
    brain_number: z.ZodNumber;
    brain_object: z.ZodObject<{}, z.core.$loose>;
    brain_query: z.ZodObject<{}, z.core.$loose>;
    brain_formula: z.ZodString;
    brain_ask: z.ZodString;
    brain_js: z.ZodString;
};
export declare const _brainAny: {
    brain_name: z.ZodString;
    brain_prop_id: z.ZodString;
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
    readonly options: z.ZodObject<{
        brain_string: z.ZodString;
    }, z.core.$strip>;
    readonly "": z.ZodObject<{
        brain: z.ZodString;
        brain_string: z.ZodString;
        brain_number: z.ZodNumber;
        brain_object: z.ZodObject<{}, z.core.$loose>;
        brain_query: z.ZodObject<{}, z.core.$loose>;
        brain_formula: z.ZodString;
        brain_ask: z.ZodString;
        brain_js: z.ZodString;
    }, z.core.$strip>;
    readonly "*": z.ZodObject<{
        brain_name: z.ZodString;
        brain_prop_id: z.ZodString;
        brain: z.ZodString;
        brain_string: z.ZodString;
        brain_number: z.ZodNumber;
        brain_object: z.ZodObject<{}, z.core.$loose>;
        brain_query: z.ZodObject<{}, z.core.$loose>;
        brain_formula: z.ZodString;
        brain_ask: z.ZodString;
        brain_js: z.ZodString;
    }, z.core.$strip>;
};
