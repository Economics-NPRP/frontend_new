'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useCallback, useContext } from 'react';

import { useCycleApproval } from '@/hooks';
import { ApprovalModalContext } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/ApprovalModal/constants';
import {
	Button,
	Checkbox,
	Group,
	Modal,
	ModalProps,
	Stack,
	Text,
	Title,
	useModalsStack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import classes from './styles.module.css';

export const ApprovalModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const { openConfirmation, close } = useContext(ApprovalModalContext);

	const form = useForm({
		mode: 'uncontrolled',
	});

	const handleSubmit = useCallback(() => openConfirmation(), [openConfirmation]);

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
					{t('dashboard.admin.cycles.details.approvalModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('dashboard.admin.cycles.details.approvalModal.description')}
				</Text>
			</Stack>
			<form className="contents" onSubmit={form.onSubmit(handleSubmit)}>
				<Stack className={classes.inputs}>
					<Checkbox
						label={t('dashboard.admin.cycles.details.confirmationModal.kpi.label')}
						description={t(
							'dashboard.admin.cycles.details.confirmationModal.kpi.description',
						)}
						required
						key={form.key('kpis')}
						{...form.getInputProps('kpis', { type: 'checkbox' })}
					/>
					<Checkbox
						label={t('dashboard.admin.cycles.details.confirmationModal.auctions.label')}
						description={t(
							'dashboard.admin.cycles.details.confirmationModal.auctions.description',
						)}
						required
						key={form.key('auctions')}
						{...form.getInputProps('auctions', { type: 'checkbox' })}
					/>
					<Checkbox
						label={t('dashboard.admin.cycles.details.confirmationModal.permits.label')}
						description={t(
							'dashboard.admin.cycles.details.confirmationModal.permits.description',
						)}
						required
						key={form.key('permits')}
						{...form.getInputProps('permits', { type: 'checkbox' })}
					/>
					<Checkbox
						label={t('dashboard.admin.cycles.details.confirmationModal.final.label')}
						description={t(
							'dashboard.admin.cycles.details.confirmationModal.final.description',
						)}
						required
						key={form.key('final')}
						{...form.getInputProps('final', { type: 'checkbox' })}
					/>
				</Stack>
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
						color="green"
						rightSection={<IconCheck size={16} />}
						type="submit"
					>
						{t('dashboard.admin.cycles.details.approvalModal.actions.approve.label')}
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export const ConfirmationModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const { id, close, closeConfirmation } = useContext(ApprovalModalContext);

	const approve = useCycleApproval(id, () => {
		queryClient.invalidateQueries({
			queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
		});
		closeConfirmation();
		close();
	});

	const handleSubmit = useCallback(() => approve.mutate(), [approve]);

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
					{t('dashboard.admin.cycles.details.confirmationModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('dashboard.admin.cycles.details.confirmationModal.description')}
				</Text>
			</Stack>
			<Group className={classes.actions}>
				<Button
					className={`${classes.secondary} ${classes.button}`}
					variant="outline"
					onClick={closeConfirmation}
				>
					{t('constants.actions.cancel.label')}
				</Button>
				<Button
					className={`${classes.primary} ${classes.button}`}
					color="green"
					rightSection={<IconCheck size={16} />}
					loading={approve.isPending}
					onClick={handleSubmit}
				>
					{t('dashboard.admin.cycles.details.confirmationModal.actions.approve.label')}
				</Button>
			</Group>
		</Modal>
	);
};

export const ApprovalModalProvider = ({ children }: PropsWithChildren) => {
	const stack = useModalsStack(['root', 'confirm']);
	const { cycleId } = useParams();

	return (
		<ApprovalModalContext.Provider
			value={{
				id: cycleId as string,
				open: () => stack.open('root'),
				close: () => stack.close('root'),
				openConfirmation: () => stack.open('confirm'),
				closeConfirmation: () => stack.close('confirm'),
			}}
		>
			{children}
			<Modal.Stack>
				<ApprovalModal {...stack.register('root')} />
				<ConfirmationModal {...stack.register('confirm')} />
			</Modal.Stack>
		</ApprovalModalContext.Provider>
	);
};
