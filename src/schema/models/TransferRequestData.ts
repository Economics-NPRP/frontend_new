import {
  InferInput,
  nonEmpty,
  object,
  pipe,
  string,
  trim
} from 'valibot';

import { TimestampSchema, PositiveNumberSchema } from '@/schema/utils';

import { PermitTransferStatusSchema } from './PermitTransferStatus';

export const BasePermitTransferDataSchema = object({
  id: PositiveNumberSchema(),
  emissionId: PositiveNumberSchema(),
  fromFirmId: pipe(string(), trim(), nonEmpty()),
  toFirmId: pipe(string(), trim(), nonEmpty()),
  quantity: PositiveNumberSchema(),

  status: PermitTransferStatusSchema,
  lockedQty: PositiveNumberSchema(),

  decidedBy: pipe(string(), trim(), nonEmpty()),
  notes: pipe(string(), trim(), nonEmpty()),
  decisionNotes: pipe(string(), trim(), nonEmpty()),

  actorFirmUserId: pipe(string(), trim(), nonEmpty()),
  actorAdminId: pipe(string(), trim(), nonEmpty()),

  createdAt: TimestampSchema(),
  decidedAt: TimestampSchema(),
});

export interface IPermitTransfer extends InferInput<typeof BasePermitTransferDataSchema> { }

export const DefaultPermitTransfer: IPermitTransfer = {
  id: 0,
  emissionId: 0,
  fromFirmId: '',
  toFirmId: '',
  quantity: 0,

  status: 'pending',
  lockedQty: 0,

  decidedBy: '',
  notes: '',
  decisionNotes: '',

  actorFirmUserId: '',
  actorAdminId: '',

  createdAt: `${Date.now()}`,
  decidedAt: `${Date.now()}`,
};
