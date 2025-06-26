import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const FirmApplicationStatusSchema = pipe(
	picklist(['pending', 'approved', 'rejected']),
	nonEmpty(),
);

export type FirmApplicationStatus = InferOutput<typeof FirmApplicationStatusSchema>;
