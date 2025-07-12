'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { BaseBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { PaginatedAdminsContext } from '@/contexts';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateCycleStepProps } from '@/pages/create/cycle/@form/page';
import { IAdminData } from '@/schema/models';
import {
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
import { IconExclamationCircle, IconMail, IconPhone, IconPlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SecondStep = ({ disabled }: ICreateCycleStepProps) => {
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
				maxMembers={1}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.operator.title')}
				description={t('constants.adminRoles.operator.description')}
				maxMembers={6}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.allocator.title')}
				description={t('constants.adminRoles.allocator.description')}
				maxMembers={3}
				disabled={disabled}
			/>
			<MemberSelection
				title={t('constants.adminRoles.finance.title')}
				description={t('constants.adminRoles.finance.description')}
				maxMembers={1}
				disabled={disabled}
			/>
			<Divider className={classes.divider} />
		</Stack>
	);
};

interface MemberSelectionProps {
	title: string;
	description: string;
	maxMembers: number;
	disabled?: boolean;
}
const MemberSelection = ({ title, description, maxMembers, disabled }: MemberSelectionProps) => {
	const t = useTranslations();
	const paginatedAdmins = useContext(PaginatedAdminsContext);

	const [selected, selectedHandlers] = useListState<IAdminData>([]);
	const [search, setSearch] = useState('');
	const combobox = useCombobox({
		onDropdownClose: () => {
			combobox.resetSelectedOption();
			combobox.focusTarget();
			setSearch('');
		},
		onDropdownOpen: () => {
			combobox.focusSearchInput();
		},
	});

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
						{selected.map((member) => (
							<MemberCard key={member.id} data={member} />
						))}
						{selected.length < maxMembers && (
							<Combobox
								store={combobox}
								withinPortal={false}
								width={320}
								middlewares={{ size: true }}
								withArrow
								onOptionSubmit={(adminId) =>
									selected.filter((admin) => admin.id === adminId).length === 0 &&
									selectedHandlers.append(
										paginatedAdmins.data.results.find(
											(admin) => admin.id === adminId,
										)!,
									)
								}
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
													paginatedAdmins.data.results.map((admin) => (
														<Combobox.Option
															key={admin.id}
															value={admin.id}
															className={classes.row}
														>
															<Avatar
																className={classes.avatar}
																color="initials"
																name={admin.name}
																size="sm"
															/>
															<Text className={classes.name}>
																{admin.name}
															</Text>
														</Combobox.Option>
													))
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
	data: IAdminData;
}
const MemberCard = ({ data }: MemberCardProps) => {
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
