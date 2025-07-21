'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { throwError } from '@/helpers';
import { createSubsector } from '@/lib/subsectors';
import { ICreateSubsector } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CreateSubsectorProps = (options?: {
	onSettled?: () => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => UseMutationResult<ServerData<{}>, Error, ICreateSubsector, unknown>;
export const useCreateSubsector: CreateSubsectorProps = ({
	onSettled,
	onSuccess,
	onError,
} = {}) => {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const subsector = useMemo(() => searchParams.get('subsector'), [searchParams]);

	return useMutation({
		mutationFn: (formData) =>
			throwError(createSubsector(formData, subsector), `createSubsector:${subsector}`),
		onSettled,
		onSuccess: (formData) => {
			if (subsector)
				queryClient.invalidateQueries({
					queryKey: [subsector, 'singleSubsector'],
				});
			queryClient.invalidateQueries({
				queryKey: ['allSubsectors'],
			});
			queryClient.invalidateQueries({
				queryKey: ['allSubsectorsBySector', formData.sector],
			});
			notifications.show({
				color: 'green',
				title: subsector
					? t('lib.subsectors.edit.success.title')
					: t('lib.subsectors.create.success.title'),
				message: subsector
					? t('lib.subsectors.edit.success.message')
					: t('lib.subsectors.create.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error creating a new auction subsector:', error.message);
			notifications.show({
				color: 'red',
				title: subsector
					? t('lib.subsectors.edit.error')
					: t('lib.subsectors.create.error'),
				message: error.message,
				position: 'bottom-center',
			});
			onError?.(error);
		},
		retry: false,
	});
};
