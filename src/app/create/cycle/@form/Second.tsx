'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { BaseBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { PaginatedAdminsContext } from '@/contexts';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateCycleStepProps } from '@/pages/create/cycle/@form/page';
import {
	AdminRole,
	DefaultCreateAuctionCycleData,
	IAdminData,
	ICreateAdmin,
	IReadAdmin,
} from '@/schema/models';
import {
	ActionIcon,
	Alert,
	Avatar,
	Button,
	Combobox,
	Container,
	Divider,
	Group,
	Input,
	List,
	Loader,
	Stack,
	Text,
	Title,
	Tooltip,
	UnstyledButton,
	useCombobox,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconExclamationCircle, IconMail, IconPhone, IconPlus, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SecondStep = ({ form, disabled }: ICreateCycleStepProps) => {
	const t = useTranslations();

	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.second} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.cycle.second.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.cycle.second.header.subheading')}
				</Text>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.cycle.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					onClose={() => setFormError([])}
					withCloseButton
				>
					<List>{formError}</List>
				</Alert>
			)}
			<MemberSelection
				title={t('constants.adminRoles.manager.title')}
				description={t('constants.adminRoles.manager.description')}
				role="manager"
				maxMembers={1}
				form={form}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.operator.title')}
				description={t('constants.adminRoles.operator.description')}
				role="auctionOperator"
				maxMembers={6}
				form={form}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.allocator.title')}
				description={t('constants.adminRoles.allocator.description')}
				role="permitStrategist"
				maxMembers={3}
				form={form}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.finance.title')}
				description={t('constants.adminRoles.finance.description')}
				role="financeOfficer"
				maxMembers={1}
				form={form}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.distributor.title')}
				description={t('constants.adminRoles.distributor.description')}
				role="permitDistributor"
				maxMembers={1}
				form={form}
				disabled={disabled}
			/>
			<Divider className={classes.divider} />
		</Stack>
	);
};

interface MemberSelectionProps {
	title: string;
	description: string;
	role: AdminRole;
	maxMembers: number;
	form: ICreateCycleStepProps['form'];
	disabled?: boolean;
}
const MemberSelection = ({
	title,
	description,
	role,
	maxMembers,
	form,
	disabled,
}: MemberSelectionProps) => {
	const t = useTranslations();
	const paginatedAdmins = useContext(PaginatedAdminsContext);

	const allSelectedAdmins = useMemo(
		() =>
			Object.entries(
				form.getValues().adminAssignments || DefaultCreateAuctionCycleData.adminAssignments,
			).reduce((acc, [, admins]) => {
				acc.push(...admins);
				return acc;
			}, [] as Array<IAdminData>),
		[form.getValues().adminAssignments],
	);

	const [selected, selectedHandlers] = useListState<IReadAdmin>([]);
	const [search, setSearch] = useState('');
	const combobox = useCombobox({
		onDropdownClose: () => {
			combobox.resetSelectedOption();
			combobox.focusTarget();
			setSearch('');
		},
		onDropdownOpen: () => {
			paginatedAdmins.setAllExcludeIds(allSelectedAdmins.map((admin) => admin.id));
			combobox.focusSearchInput();
		},
	});

	useEffect(() => {
		const currentValue =
			form.getValues().adminAssignments || DefaultCreateAuctionCycleData.adminAssignments;
		selectedHandlers.setState([...new Set(currentValue[role] || [])] as IReadAdmin[]);
	}, [form.getValues().adminAssignments]);

	const memberCards = useMemo(
		() =>
			[...new Set(selected)].map((member) => (
				<MemberCard
					key={member.id}
					data={member}
					onRemove={() => {
						const newList = selected.filter((m) => m.id !== member.id);
						selectedHandlers.setState(newList);
						form.getInputProps('adminAssignments').onChange({
							...form.getValues().adminAssignments,
							[role]: newList,
						});
						paginatedAdmins.removeFromExcludeIds(member.id);
					}}
				/>
			)),
		[selected],
	);

	const adminItems = useMemo(
		() =>
			paginatedAdmins.data.results.map((admin) => (
				<Combobox.Option key={admin.id} value={admin.id} className={classes.row}>
					<Avatar
						className={classes.avatar}
						color="initials"
						name={admin.name}
						size="sm"
					/>
					<Text className={classes.name}>{admin.name}</Text>
				</Combobox.Option>
			)),
		[paginatedAdmins.data.results],
	);

	const handleAddMember = useCallback(
		(adminId: string) => {
			if (selected.find((admin) => admin.id === adminId)) return;

			//	Make sure the admin isnt already assigned to another role
			if (allSelectedAdmins.find((admin) => admin.id === adminId)) return;

			const newList = [
				...selected,
				paginatedAdmins.data.results.find((admin) => admin.id === adminId)!,
			];
			selectedHandlers.setState(newList);
			form.getInputProps('adminAssignments').onChange({
				...(form.getValues().adminAssignments ||
					DefaultCreateAuctionCycleData.adminAssignments),
				[role]: newList,
			});
			paginatedAdmins.addToExcludeIds(adminId);
		},
		[
			selected,
			paginatedAdmins.data.results,
			role,
			form.getValues().adminAssignments,
			allSelectedAdmins,
		],
	);

	return (
		<Stack className={classes.section}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Group className={classes.row}>
						<Text className={classes.heading}>{title}</Text>
						<BaseBadge
							variant="light"
							className={classes.badge}
							color={
								selected.length > maxMembers
									? 'red'
									: selected.length === maxMembers
										? 'green'
										: 'gray'
							}
						>
							{t('create.cycle.second.selectionBadge.label', {
								value: selected.length,
								max: maxMembers,
							})}
						</BaseBadge>
					</Group>
					<Text className={classes.subheading}>{description}</Text>
				</Stack>
				<Tooltip
					label={t('create.cycle.second.viewResponsibilities.tooltip')}
					position="top"
				>
					<Button variant="outline" className={classes.button}>
						{t('create.cycle.second.viewResponsibilities.label')}
					</Button>
				</Tooltip>
			</Group>
			<Group className={classes.content}>
				<Switch value={disabled}>
					<Switch.True></Switch.True>
					<Switch.False>
						{memberCards}
						{selected.length < maxMembers && (
							<Combobox
								store={combobox}
								withinPortal={false}
								width={320}
								middlewares={{ size: true }}
								withArrow
								onOptionSubmit={handleAddMember}
							>
								<Combobox.Target>
									<UnstyledButton
										className={classes.add}
										onClick={() => combobox.openDropdown()}
									>
										<Container className={classes.icon}>
											<IconPlus size={24} />
										</Container>
										<Text className={classes.text}>
											{t('create.cycle.second.selectionAdd.label')}
										</Text>
									</UnstyledButton>
								</Combobox.Target>
								<Combobox.Dropdown className={classes.dropdown}>
									<Combobox.Search
										className={classes.search}
										value={search}
										onChange={(event) => setSearch(event.currentTarget.value)}
										placeholder={t('create.cycle.second.search')}
										rightSection={
											search !== '' ? (
												<Input.ClearButton onClick={() => setSearch('')} />
											) : undefined
										}
										rightSectionPointerEvents="auto"
									/>
									<Combobox.Options className={classes.options}>
										<Switch value={paginatedAdmins.isLoading}>
											<Switch.True>
												<Combobox.Empty>
													<Loader />
												</Combobox.Empty>
											</Switch.True>
											<Switch.False>
												{paginatedAdmins.data.resultCount > 0 ? (
													adminItems
												) : (
													<Combobox.Empty>
														{t('create.cycle.second.empty')}
													</Combobox.Empty>
												)}
											</Switch.False>
										</Switch>
									</Combobox.Options>
								</Combobox.Dropdown>
							</Combobox>
						)}
					</Switch.False>
				</Switch>
			</Group>
		</Stack>
	);
};

interface MemberCardProps {
	data: ICreateAdmin;
	onRemove: () => void;
}
const MemberCard = ({ data, onRemove }: MemberCardProps) => {
	const t = useTranslations();

	return (
		<Stack className={classes.card}>
			<Group className={classes.header}>
				<Avatar color="initials" name={data.name} />
				<Stack className={classes.label}>
					<Text className={classes.name}>{data.name}</Text>
					<Text className={classes.meta}>
						{DateTime.now()
							.minus({ hours: Math.random() * 12 })
							.toRelative()}
					</Text>
				</Stack>
				<ActionIcon className={classes.button} variant="subtle" onClick={onRemove}>
					<IconX size={16} />
				</ActionIcon>
			</Group>
			<Stack className={classes.details}>
				<Group className={classes.row}>
					<IconMail size={16} className={classes.icon} />
					<Text className={classes.value}>{data.email}</Text>
				</Group>
				<Group className={classes.row}>
					<IconPhone size={16} className={classes.icon} />
					<Text className={classes.value}>{data.phone}</Text>
				</Group>
			</Stack>
			<Group className={classes.footer}>
				<Button
					component="a"
					variant="outline"
					className={classes.button}
					href={`mailto:${data.email}`}
				>
					{t('constants.actions.email.label')}
				</Button>
				<Button
					component="a"
					variant="outline"
					className={classes.button}
					href={`tel:${data.phone}`}
				>
					{t('constants.actions.call.label')}
				</Button>
			</Group>
		</Stack>
	);
};
