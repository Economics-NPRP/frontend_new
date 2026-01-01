import {
  InferInput,
  InferOutput,
  nonEmpty,
  object,
  pipe,
  string,
  trim
} from 'valibot';

import { TimestampSchema, PositiveNumberSchema } from '@/schema/utils';

import { AuctionApplicationStatusSchema } from './AuctionApplicationStatus';
import { SectorTypeSchema } from './SectorData';

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

export const CreateAuctionApplicationDataSchema = object({
  description: pipe(string(), trim(), nonEmpty()),
  endDatetime: pipe(string(), trim(), nonEmpty()),
  sector: SectorTypeSchema,
  startDatetime: pipe(string(), trim(), nonEmpty()),
  title: pipe(string(), trim(), nonEmpty()),
  minBid: PositiveNumberSchema(),
  permits: PositiveNumberSchema(),
  emissionId: PositiveNumberSchema(),
});

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
  description: '',
  endDatetime: '',
  sector: 'energy',
  startDatetime: '',
  title: '',
  minBid: 0,
  permits: 0,
  emissionId: 0,
};

