import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const FirmApplicationStatusList = ['pending', 'approved', 'rejected'] as const;
export const FirmApplicationStatusListFilter = ['all', 'pending', 'approved', 'rejected'] as const;

export const FirmApplicationStatusSchema = pipe(picklist(FirmApplicationStatusList), nonEmpty());
export const FirmApplicationStatusFilterSchema = pipe(
	picklist(FirmApplicationStatusListFilter),
	nonEmpty(),
);

export type FirmApplicationStatus = InferOutput<typeof FirmApplicationStatusSchema>;
export type FirmApplicationStatusFilter = InferOutput<typeof FirmApplicationStatusFilterSchema>;
