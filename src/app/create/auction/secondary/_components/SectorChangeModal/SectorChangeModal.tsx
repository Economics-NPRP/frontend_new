'use client';

import { useTranslations } from 'next-intl';
import { PropsWithChildren, useCallback, useContext, useState } from 'react';

import { SectorBadge } from '@/components/Badge';
import {
	DefaultSectorChangeModalContextData,
	SectorChangeModalContext,
} from '@/pages/create/auction/secondary/_components/SectorChangeModal';
import { SectorType } from '@/schema/models';
import { Button, Group, Modal, ModalProps, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowNarrowRight, IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SectorChangeModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const { oldSector, newSector, handleConfirm, close } = useContext(SectorChangeModalContext);

	return (
		<Modal
			classNames={{
				root: `${classes.root} ${className}`,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			withCloseButton={false}
			centered
			{...props}
		>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					{t('create.auction.sectorChangeModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('create.auction.sectorChangeModal.description')}
				</Text>
			</Stack>
			<Group className={classes.comparison}>
				<Stack className={classes.cell}>
					<Text className={classes.label}>
						{t('create.auction.sectorChangeModal.oldSector.label')}
					</Text>
					<SectorBadge sector={oldSector} className={classes.badge} />
				</Stack>
				<IconArrowNarrowRight size={24} className={classes.icon} />
				<Stack className={classes.cell}>
					<Text className={classes.label}>
						{t('create.auction.sectorChangeModal.newSector.label')}
					</Text>
					<SectorBadge sector={newSector} className={classes.badge} />
				</Stack>
			</Group>
			<Group className={classes.actions}>
				<Button
					className={`${classes.secondary} ${classes.button}`}
					variant="outline"
					onClick={close}
				>
					{t('constants.actions.cancel.label')}
				</Button>
				<Button
					className={`${classes.primary} ${classes.button}`}
					rightSection={<IconCheck size={16} />}
					onClick={handleConfirm}
				>
					{t('create.auction.sectorChangeModal.actions.approve.label')}
				</Button>
			</Group>
		</Modal>
	);
};

export const SectorChangeModalProvider = ({ children }: PropsWithChildren) => {
	const [oldSector, setOldSector] = useState<SectorType>(
		DefaultSectorChangeModalContextData.oldSector,
	);
	const [newSector, setNewSector] = useState<SectorType>(
		DefaultSectorChangeModalContextData.newSector,
	);
	const [onConfirm, setOnConfirm] = useState(() => () => { });
	const [opened, { open, close }] = useDisclosure();

	const handleConfirm = useCallback(() => {
		onConfirm();
		close();
	}, [onConfirm]);

	const handleOpen = useCallback(
		(oldSector: SectorType, newSector: SectorType, onConfirm: () => void) => {
			open();
			setNewSector(newSector);
			setOldSector(oldSector);
			setOnConfirm(() => onConfirm);
		},
		[open, setNewSector, setOldSector],
	);

	return (
		<SectorChangeModalContext.Provider
			value={{
				oldSector,
				newSector,
				open: handleOpen,
				close,
				handleConfirm,
			}}
		>
			{children}
			<Modal.Stack>
				<SectorChangeModal opened={opened} onClose={close} />
			</Modal.Stack>
		</SectorChangeModalContext.Provider>
	);
};
