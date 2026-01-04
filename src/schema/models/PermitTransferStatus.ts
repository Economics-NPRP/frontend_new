import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const PermitTransferStatusList = ['pending', 'approved', 'rejected'] as const;
export const PermitTransferStatusListFilter = ['all', 'pending', 'approved', 'rejected'] as const;

export const PermitTransferStatusSchema = pipe(picklist(PermitTransferStatusList), nonEmpty());
export const PermitTransferStatusFilterSchema = pipe(
  picklist(PermitTransferStatusListFilter),
  nonEmpty(),
);

export type PermitTransferStatus = InferOutput<typeof PermitTransferStatusSchema>;
export type PermitTransferStatusFilter = InferOutput<typeof PermitTransferStatusFilterSchema>;
