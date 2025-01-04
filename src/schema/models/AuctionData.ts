import { getTranslations } from 'next-intl/server';
import {
	InferInput,
	InferOutput,
	boolean,
	minWords,
	nonEmpty,
	nullish,
	object,
	pipe,
	safeParse,
	string,
	trim,
	url,
} from 'valibot';

import { getUserLocale } from '@/locales';
import { AuctionTypeSchema } from '@/schema/models';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

const MODEL_NAME = 'AuctionData';

const locale = await getUserLocale();
const t = await getTranslations();

export const AuctionDataSchema = object({
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
	bids: PositiveNumberSchema('bids'),
	minBid: PositiveNumberSchema('minBid'),
	views: PositiveNumberSchema('views'),
	bookmarks: PositiveNumberSchema('bookmarks'),

	isVisible: boolean(({ received }) => t(`model.${MODEL_NAME}.isVisible.boolean`, { received })),
	createdAt: TimestampSchema('createdAt'),
	startDatetime: TimestampSchema('startDatetime'),
	endDatetime: TimestampSchema('endDatetime'),
	hasJoined: nullish(
		boolean(({ received }) => t(`model.${MODEL_NAME}.hasJoined.boolean`, { received })),
	),

	// /**
	//  * Data about the owner of the auction
	//  */
	// owner				: {
	// 	/**
	// 	 * The id of the owner
	// 	 */
	// 	id					: string,

	// 	/**
	// 	 * The type of the owner
	// 	 */
	// 	type				: OwnerType,

	// 	/**
	// 	 * The name of the owner
	// 	 */
	// 	name				: string,

	// 	/**
	// 	 * The email of the owner
	// 	 */
	// 	email				: string,

	// 	/**
	// 	 * The phone number of the owner
	// 	 */
	// 	phone				: string,

	// 	/**
	// 	 * The link to the image of the owner
	// 	 */
	// 	image				: string,

	// 	/**
	// 	 * Is the email of the owner verified?
	// 	 */
	// 	emailVerified		: boolean,

	// 	/**
	// 	 * Is the phone number of the owner verified?
	// 	 */
	// 	phoneVerified		: boolean,

	// 	/**
	// 	 * Is the owner active?
	// 	 */
	// 	isActive			: boolean,

	// 	/**
	// 	 * Date time at which the owner was created, format is UTC string
	// 	 */
	// 	createdAt			: string,
	// },
});

const result = safeParse(AuctionDataSchema, {
	id: '57e261bd-736f-4139-8672-d67d79e2d002',
	ownerId: 'b4d0909b-842e-41b6-ba23-f990643aa669',
	sectorId: 'b4d0909b-842e-41b6-ba23-f990643aa669',
	type: 'open',
	isPrimaryMarket: true,

	title: 'Auction 22',
	image: null,
	description: 'testing auction description',
	permits: 261,
	bids: 0,
	minBid: 868,
	views: 0,
	bookmarks: 0,

	isVisible: true,
	createdAt: '2024-12-28T10:40:06.276254Z',
	startDatetime: '2024-12-30T10:40:06.278651Z',
	endDatetime: '2025-01-03T10:40:06.278651Z',
	hasJoined: true,

	owner: {
		id: 'b4d0909b-842e-41b6-ba23-f990643aa669',
		type: 'admin',
		name: 'super_admin',
		email: 'elite0192@gmail.com',
		phone: '12345678',
		image: null,
		email_verified: false,
		phone_verified: false,
		is_active: true,
		created_at: '2024-12-28T10:40:03.867019Z',
	},
	emission: {
		name: 'Methane',
		symbol: 'CH4',
		permit_size: 1000000,
		total_permits: 10000,
		id: 2,
		created_at: '2024-12-28T10:40:03.787266Z',
	},
});
console.log(result);

export interface AuctionData extends InferOutput<typeof AuctionDataSchema> {}
export interface AuctionDataInput extends InferInput<typeof AuctionDataSchema> {}
