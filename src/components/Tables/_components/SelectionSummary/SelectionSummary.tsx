'use client';

import { useTranslations } from 'next-intl';
import { PropsWithChildren, useCallback, useContext, useState } from 'react';

import { SummaryTable } from '@/components/SummaryTable';
import {
	DefaultSelectionSummaryContextData,
	ISelectionSummaryContext,
	SelectionSummaryContext,
} from '@/components/Tables/_components/SelectionSummary';
import { Button, Group, Modal, ModalProps, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SelectionSummaryModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const { selectedRecords, generateSummaryGroups, close } = useContext(SelectionSummaryContext);

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
					{t('components.table.selected.summary.title')}
				</Title>
				<Text className={classes.description}>
					{t('components.table.selected.summary.description', {
						value: selectedRecords.length,
					})}
				</Text>
			</Stack>
			<SummaryTable groups={generateSummaryGroups(selectedRecords)} />
			<Group className={classes.actions}>
				<Button
					className={`${classes.secondary} ${classes.button}`}
					variant="outline"
					onClick={close}
				>
					{t('constants.actions.close.label')}
				</Button>
				{/* TODO: add download functionality */}
				<Button
					className={`${classes.primary} ${classes.button}`}
					rightSection={<IconDownload size={16} />}
				>
					{t('constants.download.default')}
				</Button>
			</Group>
		</Modal>
	);
};

export const SelectionSummaryProvider = ({ children }: PropsWithChildren) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedRecords, setSelectedRecords] = useState<
		ISelectionSummaryContext['selectedRecords']
	>(DefaultSelectionSummaryContextData.selectedRecords);
	const [generateSummaryGroups, setGenerateSummaryGroups] = useState<
		ISelectionSummaryContext['generateSummaryGroups']
	>(() => DefaultSelectionSummaryContextData.generateSummaryGroups);

	const handleOpen: ISelectionSummaryContext['open'] = useCallback(
		(selectedRecords, generateSummaryGroups) => {
			open();
			setSelectedRecords(selectedRecords);
			setGenerateSummaryGroups(() => generateSummaryGroups);
		},
		[open, setSelectedRecords],
	);

	const handleClose: ISelectionSummaryContext['close'] = useCallback(() => {
		close();
		setSelectedRecords(DefaultSelectionSummaryContextData.selectedRecords);
	}, [close, setSelectedRecords]);

	return (
		<SelectionSummaryContext.Provider
			value={{
				selectedRecords,
				generateSummaryGroups,
				open: handleOpen,
				close: handleClose,
			}}
		>
			{children}
			<Modal.Stack>
				<SelectionSummaryModal opened={opened} onClose={close} />
			</Modal.Stack>
		</SelectionSummaryContext.Provider>
	);
};
