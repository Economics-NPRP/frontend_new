import { useTranslations } from 'next-intl';

import { throwError } from '@/helpers';
import { inviteUser } from '@/lib/invitations';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

type InviteUserProps = (
	id: string,
	onSuccess?: () => void,
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useInviteUser: InviteUserProps = (id, onSuccess) => {
	const t = useTranslations();

	return useMutation({
		mutationFn: () => throwError(inviteUser(id)),
		onSuccess: () => {
			notifications.show({
				color: 'green',
				title: t('lib.invitations.invite.success.title'),
				message: t('lib.invitations.invite.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: t('lib.invitations.invite.error'),
				message: error.message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});
};
