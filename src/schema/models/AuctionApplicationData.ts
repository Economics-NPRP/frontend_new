import {
  InferInput,
  InferOutput,
  email,
  integer,
  minValue,
  nonEmpty,
  nullish,
  number,
  object,
  omit,
  optional,
  pick,
  pipe,
  string,
  transform,
  trim,
  url,
} from 'valibot';

import { TimestampSchema, UuidSchema, PositiveNumber, PositiveNumberSchema } from '@/schema/utils';

import { AuctionApplicationStatus, AuctionApplicationStatusSchema } from './AuctionApplicationStatus';
import { SectorListSchema } from './SectorData';

// Change company image to pipe
export const BaseAuctionApplicationDataSchema = object({
  id: PositiveNumberSchema(),
  auctionId: pipe(string(), trim(), nonEmpty()),
  requestedById: pipe(string(), trim(), nonEmpty()),

  status: AuctionApplicationStatusSchema,

  decidedById: pipe(string(), trim(), nonEmpty()),
  decisionNotes: pipe(string(), trim(), nonEmpty()),

  executedById: pipe(string(), trim(), nonEmpty()),
  executionNotes: pipe(string(), trim(), nonEmpty()),

  requestedAt: TimestampSchema(),
  decidedAt: TimestampSchema(),
  lockedAt: TimestampSchema(),
  executedAt: TimestampSchema(),

});

export const CreateAuctionApplicationDataSchema = omit(BaseAuctionApplicationDataSchema, [
  'id',
  'status'
]);

export interface IAuctionApplication extends InferOutput<typeof BaseAuctionApplicationDataSchema> { }
export interface ICreateAuctionApplication
  extends InferInput<typeof CreateAuctionApplicationDataSchema> { }


export const DefaultAuctionApplication: IAuctionApplication = {
  id: 0,
  auctionId: '',
  requestedById: '',

  status: 'pending',

  decidedById: '',
  decisionNotes: '',

  executedById: '',
  executionNotes: '',

  requestedAt: '',
  decidedAt: '',
  lockedAt: '',
  executedAt: '',
};

export const DefaultCreateAuctionApplication: ICreateAuctionApplication = {
  auctionId: '',
  requestedById: '',
  decidedById: '',
  decisionNotes: '',
  executedById: '',
  executionNotes: '',
  requestedAt: '',
  decidedAt: '',
  lockedAt: '',
  executedAt: '',
};

