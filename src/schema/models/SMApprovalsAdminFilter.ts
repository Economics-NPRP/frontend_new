import { InferOutput, object, optional, pipe, string, trim, nonEmpty } from 'valibot';

import { PositiveNumberSchema } from '@/schema/utils';
import { AuctionApplicationStatusFilterSchema } from '@/schema/models/AuctionApplicationStatus';

export const SMApprovalsFiltersDataSchema = object({
  status: optional(AuctionApplicationStatusFilterSchema),
  emissionId: optional(PositiveNumberSchema()),
  toFirmId: optional(pipe(string(), trim(), nonEmpty())),
  fromFirmId: optional(pipe(string(), trim(), nonEmpty())),
  createdFrom: optional(pipe(string(), trim(), nonEmpty())),
  createdTo: optional(pipe(string(), trim(), nonEmpty())),
});

export type SMApprovalsFiltersData = InferOutput<typeof SMApprovalsFiltersDataSchema>;

export const DefaultSMApprovalsFiltersData: SMApprovalsFiltersData = {
  status: 'all',
  emissionId: 0,
  toFirmId: '',
  fromFirmId: '',
  createdFrom: '',
  createdTo: '',
};
