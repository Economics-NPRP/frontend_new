import { getTranslations } from 'next-intl/server';
import {
	InferInput,
	InferOutput,
	boolean,
	minWords,
	nonEmpty,
	nullish,
	object,
	omit,
	pipe,
	string,
	trim,
	url,
} from 'valibot';

import { getUserLocale } from '@/locales';
import { AuctionTypeSchema, BaseUserDataSchema } from '@/schema/models';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

const MODEL_NAME = 'AuctionData';

const locale = await getUserLocale();
const t = await getTranslations();

export const BaseAuctionDataSchema = object({
	id: UuidSchema('id'),
	ownerId: UuidSchema('ownerId'),
	sectorId: UuidSchema('sectorId'),
	type: AuctionTypeSchema,
	isPrimaryMarket: boolean(({ received }) =>
		t(`model.${MODEL_NAME}.isPrimaryMarket.boolean`, { received }),
	),

	title: pipe(
		string(({ received }) => t(`model.${MODEL_NAME}.title.string`, { received })),
		trim(),
		nonEmpty(() => t(`model.${MODEL_NAME}.title.required`)),
		minWords(locale, 1, ({ received }) => t(`model.${MODEL_NAME}.title.words`, { received })),
	),
	image: nullish(
		pipe(
			string(({ received }) => t(`model.${MODEL_NAME}.image.string`, { received })),
			trim(),
			url(({ received }) => t(`model.${MODEL_NAME}.image.url`, { received })),
		),
	),
	description: nullish(
		pipe(
			string(({ received }) => t(`model.${MODEL_NAME}.description.string`, { received })),
			trim(),
			minWords(locale, 1, ({ received }) =>
				t(`model.${MODEL_NAME}.description.words`, { received }),
			),
		),
	),
	permits: PositiveNumberSchema('permits'),
	bids: PositiveNumberSchema('bids', true),
	minBid: PositiveNumberSchema('minBid'),
	views: PositiveNumberSchema('views', true),
	bookmarks: PositiveNumberSchema('bookmarks', true),

	isVisible: boolean(({ received }) => t(`model.${MODEL_NAME}.isVisible.boolean`, { received })),
	createdAt: TimestampSchema('createdAt'),
	startDatetime: TimestampSchema('startDatetime'),
	endDatetime: TimestampSchema('endDatetime'),
	hasJoined: nullish(
		boolean(({ received }) => t(`model.${MODEL_NAME}.hasJoined.boolean`, { received })),
	),

	owner: BaseUserDataSchema,
});

export const CreateAuctionDataSchema = omit(BaseAuctionDataSchema, [
	'id',

	'bids',
	'views',
	'bookmarks',

	'isVisible',
	'createdAt',
	'hasJoined',

	'owner',
]);

export const ReadAuctionDataSchema = BaseAuctionDataSchema;
export const UpdateAuctionDataSchema = CreateAuctionDataSchema;

export interface IAuctionData extends InferOutput<typeof BaseAuctionDataSchema> {}
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchema> {}
export interface IReadAuction extends InferInput<typeof ReadAuctionDataSchema> {}
export interface IUpdateAuction extends InferInput<typeof UpdateAuctionDataSchema> {}
