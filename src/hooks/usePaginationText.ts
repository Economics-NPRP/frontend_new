import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { KeysetPaginatedContextState, OffsetPaginatedContextState } from '@/types';

export const useOffsetPaginationText = (
	type: 'results' | 'firms' | 'auctionCycles',
	{ page, perPage, data: { totalCount } }: OffsetPaginatedContextState<unknown>,
) => {
	const t = useTranslations();

	return useMemo(
		() =>
			t(`constants.pagination.offset.${type}`, {
				start: Math.min((page - 1) * perPage + 1, totalCount),
				end:
					(page - 1) * perPage + perPage > totalCount
						? totalCount
						: (page - 1) * perPage + perPage,
				total: totalCount,
			}),
		[t, page, perPage, totalCount],
	);
};

export const useKeysetPaginationText = (
	type: 'bids' | 'firmApplications',
	{ perPage, data: { isExact, totalCount } }: KeysetPaginatedContextState<unknown>,
) => {
	const t = useTranslations();

	return useMemo(
		() =>
			t(`constants.pagination.keyset.${type}`, {
				count: Math.min(perPage, totalCount),
				isExact,
				total: totalCount,
			}),
		[t, perPage, isExact, totalCount],
	);
};
