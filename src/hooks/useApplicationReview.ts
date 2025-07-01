'use client';

import { useTranslations } from 'next-intl';

import { throwError } from '@/helpers';
import { approveApplication, rejectApplication } from '@/lib/users/firms/applications';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

type ApplicationReviewProps = (
	id: string,
	options?: {
		onApproveSuccess?: () => void;
		onRejectSuccess?: () => void;
	},
) => {
	approve: UseMutationResult<ServerData<{}>, Error, void, unknown>;
	reject: UseMutationResult<ServerData<{}>, Error, string, unknown>;
};
export const useApplicationReview: ApplicationReviewProps = (
	id,
	{ onApproveSuccess, onRejectSuccess } = {},
) => {
	const t = useTranslations();

	const approve = useMutation({
		mutationFn: () => throwError(approveApplication(id), `approveApplication:${id}`),
		onSuccess: () => {
			notifications.show({
				color: 'green',
				title: t('lib.users.firms.applications.approve.success.title'),
				message: t('lib.users.firms.applications.approve.success.message'),
				position: 'bottom-center',
			});
			onApproveSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: t('lib.users.firms.applications.approve.error'),
				message: error.message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});

	const reject = useMutation({
		mutationFn: (reason: string) =>
			throwError(rejectApplication(id, reason), `rejectApplication:${id}`),
		onSuccess: () => {
			notifications.show({
				color: 'green',
				title: t('lib.users.firms.applications.reject.success.title'),
				message: t('lib.users.firms.applications.reject.success.message'),
				position: 'bottom-center',
			});
			onRejectSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: t('lib.users.firms.applications.reject.error'),
				message: error.message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});

	return { approve, reject };
};
