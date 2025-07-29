import { InferOutput, boolean, object, omit, optional, pipe, transform } from 'valibot';

import { AuctionJoinedStatusFilterSchema } from './AuctionJoinedStatus';
import { AuctionOwnershipFilterSchema } from './AuctionOwnership';
import { AuctionStatusFilterSchema } from './AuctionStatus';
import { AuctionTypeFilterSchema } from './AuctionType';
import { SectorListFilterSchema, SectorType } from './SectorData';

export const QueryFiltersDataSchema = object({
	type: optional(AuctionTypeFilterSchema),
	status: optional(AuctionStatusFilterSchema),
	sector: optional(SectorListFilterSchema),
	joined: optional(AuctionJoinedStatusFilterSchema),
	ownership: optional(AuctionOwnershipFilterSchema),
});

export const ComponentFiltersDataSchema = object({
	...omit(QueryFiltersDataSchema, ['sector']).entries,
	sector: object({
		energy: optional(boolean()),
		industry: optional(boolean()),
		transport: optional(boolean()),
		buildings: optional(boolean()),
		agriculture: optional(boolean()),
		waste: optional(boolean()),
	}),
});

export const QueryToComponentFiltersDataTransformer = pipe(
	QueryFiltersDataSchema,
	transform((input) => ({
		...input,

		sector: {
			energy: input.sector?.includes('energy') || false,
			industry: input.sector?.includes('industry') || false,
			transport: input.sector?.includes('transport') || false,
			buildings: input.sector?.includes('buildings') || false,
			agriculture: input.sector?.includes('agriculture') || false,
			waste: input.sector?.includes('waste') || false,
		},
	})),
);

export const ComponentToQueryFiltersDataTransformer = pipe(
	ComponentFiltersDataSchema,
	transform((input) => ({
		...input,

		sector: Object.keys(input.sector).filter((key) => input.sector[key as SectorType]),
	})),
);

export type QueryFiltersData = InferOutput<typeof QueryFiltersDataSchema>;
export type ComponentFiltersData = InferOutput<typeof ComponentFiltersDataSchema>;

export const DefaultQueryFiltersData: QueryFiltersData = {
	type: 'all',
	status: 'all',
	sector: [],
	joined: 'all',
	ownership: 'all',
};

export const DefaultComponentFiltersData: ComponentFiltersData = {
	type: 'all',
	status: 'all',
	sector: {
		energy: false,
		industry: false,
		transport: false,
		buildings: false,
		agriculture: false,
		waste: false,
	},
	joined: 'all',
	ownership: 'all',
};
