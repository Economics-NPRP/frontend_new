import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const PermitUsageList = ['high', 'medium', 'low'] as const;
export const PermitUsageListFilter = ['all', 'high', 'medium', 'low'] as const;

export const PermitUsageSchema = pipe(picklist(PermitUsageList), nonEmpty());
export const PermitUsageFilterSchema = pipe(picklist(PermitUsageListFilter), nonEmpty());

export type PermitUsage = InferOutput<typeof PermitUsageSchema>;
export type PermitUsageFilter = InferOutput<typeof PermitUsageFilterSchema>;
