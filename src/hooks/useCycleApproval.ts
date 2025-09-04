'use client';

import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { approveCycle } from '@/lib/cycles';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CycleApprovalProps = (
	id: string,
	onSuccess?: () => void,
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useCycleApproval: CycleApprovalProps = (id, onSuccess) => {
	const t = useTranslations();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => throwError(approveCycle(id), `approveCycle:${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', id, 'singleCycle'],
			});
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedAuctionCycles'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.cycles.approve.success.title'),
				message: t('lib.cycles.approve.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: t('lib.cycles.approve.error'),
				message: isolateMessage(error.message),
				position: 'bottom-center',
			});
		},
		retry: false,
	});
};
