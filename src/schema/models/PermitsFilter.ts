import { InferOutput, nonEmpty, object, picklist, optional, pipe, array } from 'valibot';

export type PermitsFilterType = 'all' | 'pending' | 'approved' | 'rejected' | 'locked' | 'unlocked' | 'expired' | 'valid';
export const PermitsFilter: PermitsFilterType[] = ['all', 'pending', 'approved', 'rejected', 'locked', 'unlocked', 'expired', 'valid'] as const;

const PermitTypeSchema = pipe(picklist(PermitsFilter), nonEmpty());

export const PermitsQueryFiltersDataSchema = object({
  type: optional(array(PermitTypeSchema)),
});

export type PermitsQueryFiltersData = InferOutput<typeof PermitsQueryFiltersDataSchema>;

export const DefaultPermitsQueryFiltersData: PermitsQueryFiltersData = {
  type: ['all'],
};

