'use client';

import { useTranslations } from 'next-intl';

import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type JoinAuctionProps = (
	id: string,
	onSuccess?: () => void,
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useJoinAuction: JoinAuctionProps = (id, onSuccess) => {
	const t = useTranslations();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => throwError(joinAuction(id), `joinAuction:${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['marketplace', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', 'paginatedAuctions'],
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: t('lib.auction.join.error'),
				message: error.message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});
};
