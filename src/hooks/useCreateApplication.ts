'use client';

import { useTranslations } from 'next-intl';

import { throwError } from '@/helpers';
import { createApplication } from '@/lib/users/firms/applications';
import { ICreateFirmApplication } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CreateApplicationProps = (options?: {
	onSettled?: () => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => UseMutationResult<ServerData<{}>, Error, ICreateFirmApplication, unknown>;
export const useCreateApplication: CreateApplicationProps = ({
	onSettled,
	onSuccess,
	onError,
} = {}) => {
	const t = useTranslations();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (formData) => throwError(createApplication(formData), 'createApplication'),
		onSettled,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.users.firms.applications.create.success.title'),
				message: t('lib.users.firms.applications.create.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error creating a new application:', error.message);
			notifications.show({
				color: 'red',
				title: t('lib.users.firms.applications.create.error'),
				message: error.message,
				position: 'bottom-center',
			});
			onError?.(error);
		},
		retry: false,
	});
};
