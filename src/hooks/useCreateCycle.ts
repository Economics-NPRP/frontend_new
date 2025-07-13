'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { throwError } from '@/helpers';
import { createAuctionCycle } from '@/lib/cycles';
import { ICreateAuctionCycleOutput } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CreateCycleProps = (options: {
	onSettled?: () => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => UseMutationResult<ServerData<{}>, Error, ICreateAuctionCycleOutput, unknown>;
export const useCreateCycle: CreateCycleProps = ({ onSettled, onSuccess, onError }) => {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const cycleId = useMemo(() => searchParams.get('cycleId'), [searchParams]);

	return useMutation({
		mutationFn: (formData) =>
			throwError(createAuctionCycle(formData, cycleId), `createCycle:${cycleId}`),
		onSettled,
		onSuccess: () => {
			if (cycleId)
				queryClient.invalidateQueries({
					queryKey: ['dashboard', 'admin', cycleId, 'singleCycle'],
				});
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedAuctionCycles'],
			});
			notifications.show({
				color: 'green',
				title: cycleId
					? t('lib.cycles.edit.success.title')
					: t('lib.cycles.create.success.title'),
				message: cycleId
					? t('lib.cycles.edit.success.message')
					: t('lib.cycles.create.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error creating a new auction cycle:', error.message);
			notifications.show({
				color: 'red',
				title: cycleId ? t('lib.cycles.edit.error') : t('lib.cycles.create.error'),
				message: error.message,
				position: 'bottom-center',
			});
			onError?.(error);
		},
		retry: false,
	});
};
