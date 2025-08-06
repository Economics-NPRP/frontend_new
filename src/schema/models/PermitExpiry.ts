import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const PermitExpiryList = ['unexpired', 'expired'] as const;
export const PermitExpiryListFilter = ['all', 'unexpired', 'expired'] as const;

export const PermitExpirySchema = pipe(picklist(PermitExpiryList), nonEmpty());
export const PermitExpiryFilterSchema = pipe(picklist(PermitExpiryListFilter), nonEmpty());

export type PermitExpiry = InferOutput<typeof PermitExpirySchema>;
export type PermitExpiryFilter = InferOutput<typeof PermitExpiryFilterSchema>;
