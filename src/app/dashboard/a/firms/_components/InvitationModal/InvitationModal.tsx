'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { PropsWithChildren, useCallback, useContext, useState } from 'react';
import { minLength, nonEmpty, object, pipe, string, trim } from 'valibot';

import { FirmApplicationSummary } from '@/components/FirmApplicationSummary';
import { useApplicationReview } from '@/hooks';
import {
	DefaultInvitationModalContextData,
	InvitationModalContext,
} from '@/pages/dashboard/a/firms/_components/InvitationModal/constants';
import { IFirmApplication } from '@/schema/models';
import {
	Button,
	Group,
	Modal,
	ModalProps,
	Stack,
	Text,
	Textarea,
	Title,
	useModalsStack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import classes from './styles.module.css';

export const InvitationModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const { data, openReject, close } = useContext(InvitationModalContext);

	const { approve } = useApplicationReview(data.id, {
		onApproveSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
			});
			close();
		},
	});

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
					{t('dashboard.admin.firms.invitationModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('dashboard.admin.firms.invitationModal.description')}
				</Text>
			</Stack>
			<FirmApplicationSummary firmData={data} />
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
					color="red"
					rightSection={<IconX size={16} />}
					onClick={openReject}
				>
					{t('dashboard.admin.firms.invitationModal.actions.reject.label')}
				</Button>
				<Button
					className={`${classes.primary} ${classes.button}`}
					color="green"
					rightSection={<IconCheck size={16} />}
					loading={approve.isPending}
					onClick={() => approve.mutate()}
				>
					{t('dashboard.admin.firms.invitationModal.actions.approve.label')}
				</Button>
			</Group>
		</Modal>
	);
};

export const RejectionModal = ({ className, ...props }: ModalProps) => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const { data, close, closeReject } = useContext(InvitationModalContext);

	const { reject } = useApplicationReview(data.id);

	const form = useForm({
		mode: 'uncontrolled',
		validate: valibotResolver(
			object({ reason: pipe(string(), trim(), nonEmpty(), minLength(10)) }),
		),
	});

	const handleSubmit = useCallback(
		({ reason }: { reason: string }) => {
			form.setSubmitting(true);
			reject.mutate(reason, {
				onSuccess: () => {
					form.setSubmitting(false);
					queryClient.invalidateQueries({
						queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
					});
					closeReject();
					close();
				},
				onError: (error: Error) => {
					form.setSubmitting(false);
					form.setErrors({ reason: error.message });
				},
			});
		},
		[form, reject, close],
	);

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
					{t('dashboard.admin.firms.rejectionModal.title')}
				</Title>
				<Text className={classes.description}>
					{t('dashboard.admin.firms.rejectionModal.description')}
				</Text>
			</Stack>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Textarea
					label={t('dashboard.admin.firms.rejectionModal.reason.label')}
					description={t('dashboard.admin.firms.rejectionModal.reason.description')}
					placeholder={t('dashboard.admin.firms.rejectionModal.reason.placeholder')}
					resize="vertical"
					minRows={4}
					minLength={10}
					required
					autosize
					key={form.key('reason')}
					{...form.getInputProps('reason')}
				/>
				<Group className={classes.actions}>
					<Button
						className={`${classes.secondary} ${classes.button}`}
						variant="outline"
						onClick={closeReject}
					>
						{t('constants.actions.cancel.label')}
					</Button>
					<Button
						className={`${classes.primary} ${classes.button}`}
						color="red"
						rightSection={<IconX size={16} />}
						type="submit"
						loading={form.submitting}
					>
						{t('dashboard.admin.firms.rejectionModal.actions.reject.label')}
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export const InvitationModalProvider = ({ children }: PropsWithChildren) => {
	const [data, setData] = useState<IFirmApplication>(DefaultInvitationModalContextData.data);
	const stack = useModalsStack(['root', 'reject']);

	const handleOpen = useCallback(
		(data: IFirmApplication) => {
			stack.open('root');
			setData(data);
		},
		[stack, setData],
	);

	const handleClose = useCallback(() => {
		stack.close('root');
		setData(DefaultInvitationModalContextData.data);
	}, [stack, setData]);

	return (
		<InvitationModalContext.Provider
			value={{
				data,
				open: handleOpen,
				close: handleClose,
				openReject: () => stack.open('reject'),
				closeReject: () => stack.close('reject'),
			}}
		>
			{children}
			<Modal.Stack>
				<InvitationModal {...stack.register('root')} />
				<RejectionModal {...stack.register('reject')} />
			</Modal.Stack>
		</InvitationModalContext.Provider>
	);
};
