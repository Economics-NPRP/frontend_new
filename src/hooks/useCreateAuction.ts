'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { throwError } from '@/helpers';
import { createAuction } from '@/lib/auctions';
import { ICreateAuctionOutput } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CreateAuctionProps = (options?: {
	onSettled?: () => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => UseMutationResult<ServerData<{}>, Error, ICreateAuctionOutput, unknown>;
export const useCreateAuction: CreateAuctionProps = ({ onSettled, onSuccess, onError } = {}) => {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const cycleId = useMemo(() => searchParams.get('cycleId'), [searchParams]);

	return useMutation({
		mutationFn: (formData) => throwError(createAuction(formData), `createAuction:${cycleId}`),
		onSettled,
		onSuccess: () => {
			if (cycleId)
				queryClient.invalidateQueries({
					queryKey: ['dashboard', 'admin', cycleId as string, 'paginatedAuctionsInCycle'],
				});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', 'paginatedAuctions'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.auctions.create.success.title'),
				message: t('lib.auctions.create.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error creating a new auction:', error.message);
			notifications.show({
				color: 'red',
				title: t('lib.auctions.create.error'),
				message: error.message,
				position: 'bottom-center',
			});
			onError?.(error);
		},
		retry: false,
	});
};
