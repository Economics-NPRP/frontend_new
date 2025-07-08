'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { BaseBadge } from '@/components/Badge';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { IAdminData } from '@/schema/models';
import {
	Alert,
	Avatar,
	Button,
	Container,
	Divider,
	Group,
	List,
	Stack,
	Text,
	Title,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconExclamationCircle, IconMail, IconPhone, IconPlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SecondStep = () => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);

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
				>
					<List>{formError}</List>
				</Alert>
			)}
			<MemberSelection
				title={t('constants.adminRoles.manager.title')}
				description={t('constants.adminRoles.manager.description')}
				maxMembers={1}
			/>
			<MemberSelection
				title={t('constants.adminRoles.operator.title')}
				description={t('constants.adminRoles.operator.description')}
				maxMembers={6}
			/>
			<MemberSelection
				title={t('constants.adminRoles.allocator.title')}
				description={t('constants.adminRoles.allocator.description')}
				maxMembers={3}
			/>
			<MemberSelection
				title={t('constants.adminRoles.finance.title')}
				description={t('constants.adminRoles.finance.description')}
				maxMembers={1}
			/>
			<Divider className={classes.divider} />
		</Stack>
	);
};

interface MemberSelectionProps {
	title: string;
	description: string;
	maxMembers: number;
}
const MemberSelection = ({ title, description, maxMembers }: MemberSelectionProps) => {
	const t = useTranslations();

	const [selected, selectedHandlers] = useListState<IAdminData>([
		{
			id: 'a523474c-af06-45af-ae30-04092a61d94c',
			name: 'Person A',
			email: 'test@gmail.com',
			phone: '12345678',
			type: 'admin',
			createdAt: DateTime.now().toISO(),
			emailVerified: true,
			phoneVerified: true,
			isActive: true,
			isSuperadmin: true,
		},
		{
			id: 'a523474c-af06-45af-ae30-04092a61d94d',
			name: 'Person B',
			email: 'test@gmail.com',
			phone: '12345678',
			type: 'admin',
			createdAt: DateTime.now().toISO(),
			emailVerified: true,
			phoneVerified: true,
			isActive: true,
			isSuperadmin: true,
		},
		{
			id: 'a523474c-af06-45af-ae30-04092a61d94e',
			name: 'Person C',
			email: 'test@gmail.com',
			phone: '12345678',
			type: 'admin',
			createdAt: DateTime.now().toISO(),
			emailVerified: true,
			phoneVerified: true,
			isActive: true,
			isSuperadmin: true,
		},
	]);

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
				{selected.map((member) => (
					<MemberCard key={member.id} data={member} />
				))}
				{selected.length < maxMembers && (
					<UnstyledButton className={classes.add}>
						<Container className={classes.icon}>
							<IconPlus size={24} />
						</Container>
						<Text className={classes.text}>
							{t('create.cycle.second.selectionAdd.label')}
						</Text>
					</UnstyledButton>
				)}
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
