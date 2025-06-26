'use client';

import { useInviteUser } from 'hooks/useInviteUser';
import { useTranslations } from 'next-intl';
import { PropsWithChildren, useCallback, useContext, useState } from 'react';

import { FirmApplicationSummary } from '@/components/FirmApplicationSummary';
import {
	DefaultInvitationModalContextData,
	InvitationModalContext,
} from '@/pages/dashboard/a/firms/_components/InvitationModal/constants';
import { IFirmData } from '@/schema/models';
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';

import classes from './styles.module.css';

export const InvitationModal = () => {
	const t = useTranslations();
	const { firmData, opened, close } = useContext(InvitationModalContext);

	const inviteUser = useInviteUser(firmData.id, () => close());

	return (
		<Modal
			classNames={{
				root: classes.root,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			opened={opened}
			onClose={close}
			withCloseButton={false}
			centered
		>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					{t('dashboard.admin.firms.invitationModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('dashboard.admin.firms.invitationModal.description')}
				</Text>
			</Stack>
			<FirmApplicationSummary firmData={firmData} />
			<Group className={classes.actions}>
				<Button
					className={`${classes.secondary} ${classes.button}`}
					variant="outline"
					onClick={close}
				>
					{t('constants.actions.cancel.label')}
				</Button>
				<Button
					className={classes.button}
					color="green"
					rightSection={<IconSend size={16} />}
					loading={inviteUser.isPending}
					onClick={() => inviteUser.mutate()}
				>
					{t('dashboard.admin.firms.invitationModal.actions.cta.label')}
				</Button>
			</Group>
		</Modal>
	);
};

export const InvitationModalProvider = ({ children }: PropsWithChildren) => {
	const [opened, { open, close }] = useDisclosure(DefaultInvitationModalContextData.opened);
	const [firmData, setFirmData] = useState<IFirmData>(DefaultInvitationModalContextData.firmData);

	const handleOpen = useCallback(
		(firmData: IFirmData) => {
			open();
			setFirmData(firmData);
		},
		[open, setFirmData],
	);

	return (
		<InvitationModalContext.Provider
			value={{
				firmData,
				opened,
				open: handleOpen,
				close,
			}}
		>
			{children}
			<InvitationModal />
		</InvitationModalContext.Provider>
	);
};
