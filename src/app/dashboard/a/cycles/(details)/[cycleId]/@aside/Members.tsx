'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useMemo } from 'react';

import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { SingleCycleContext } from '@/contexts';
import { useCycleStatus } from '@/hooks';
import { DefaultAdminData, IAdminData } from '@/schema/models';
import { AdminRole } from '@/schema/models/AdminRole';
import { ActionIcon, Avatar, Button, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import {
	IconDots,
	IconInfoCircle,
	IconMail,
	IconPencil,
	IconPhone,
	IconUserCircle,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const MembersContent = () => {
	const t = useTranslations();
	const cycle = useContext(SingleCycleContext);

	const { isUpcoming } = useCycleStatus(cycle.data);

	const groupedAdmins = useMemo(
		() =>
			cycle.data.adminAssignments.reduce(
				(acc, admin) => {
					acc[admin.role].push(admin.admin);
					return acc;
				},
				{
					manager: [],
					auctionOperator: [],
					permitStrategist: [],
					financeOfficer: [],
					permitDistributor: [],
				} as Record<AdminRole, Array<IAdminData>>,
			),
		[cycle.data.adminAssignments],
	);

	return (
		<Stack className={`${classes.members} ${classes.content}`}>
			<MemberSection
				title={t('constants.adminRoles.manager.title')}
				description={t('constants.adminRoles.manager.description')}
				members={groupedAdmins.manager}
				loading={cycle.isLoading}
			/>
			<MemberSection
				title={t('constants.adminRoles.operator.title')}
				description={t('constants.adminRoles.operator.description')}
				members={groupedAdmins.auctionOperator}
				loading={cycle.isLoading}
			/>
			<MemberSection
				title={t('constants.adminRoles.allocator.title')}
				description={t('constants.adminRoles.allocator.description')}
				members={groupedAdmins.permitStrategist}
				loading={cycle.isLoading}
			/>
			<MemberSection
				title={t('constants.adminRoles.finance.title')}
				description={t('constants.adminRoles.finance.description')}
				members={groupedAdmins.financeOfficer}
				loading={cycle.isLoading}
			/>
			{isUpcoming && cycle.data.status === 'draft' && (
				<Button
					variant="outline"
					component={Link}
					href={`/create/cycle?cycleId=${cycle.data.id}&step=2`}
					loading={cycle.isLoading}
					rightSection={<IconPencil size={16} />}
				>
					{t('dashboard.admin.cycles.details.aside.members.edit')}
				</Button>
			)}
		</Stack>
	);
};

interface MemberSectionProps {
	title: string;
	description: string;
	members: Array<IAdminData>;
	loading?: boolean;
}
const MemberSection = ({ title, description, members, loading = false }: MemberSectionProps) => {
	return (
		<Stack className={classes.section}>
			<Group className={classes.header}>
				<Text className={classes.title}>{title}</Text>
				<Tooltip label={description} position="top">
					<ActionIcon variant="subtle" className={classes.info}>
						<IconInfoCircle size={14} />
					</ActionIcon>
				</Tooltip>
			</Group>
			<Switch value={loading}>
				<Switch.True>
					<MemberCard data={DefaultAdminData} loading />
				</Switch.True>
				<Switch.False>
					{members.map((member) => (
						<MemberCard key={member.id} data={member} />
					))}
				</Switch.False>
			</Switch>
		</Stack>
	);
};

interface MemberCardProps {
	data: IAdminData;
	loading?: boolean;
}
export const MemberCard = ({ data, loading = false }: MemberCardProps) => {
	const t = useTranslations();

	return (
		<Group className={classes.card}>
			<WithSkeleton loading={loading} width={40} height={40} circle>
				<Avatar color="initials" name={data.name} />
			</WithSkeleton>
			<Stack className={classes.label}>
				<WithSkeleton loading={loading} width={160} height={20} className="my-0.5">
					<Text className={classes.name}>{data.name}</Text>
				</WithSkeleton>
				<WithSkeleton loading={loading} width={140} height={14} className="my-0.5">
					<Text className={classes.meta}>
						{t('constants.lastOnline.default', {
							value: DateTime.now()
								.minus({ hours: Math.random() * 12 })
								.toRelative(),
						})}
					</Text>
				</WithSkeleton>
			</Stack>
			<Menu width={200}>
				<Menu.Target>
					<ActionIcon variant="subtle" className={classes.actions}>
						<IconDots size={14} />
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item
						component={Link}
						href={`/dashboard/a/admins/${data.id}`}
						target="_blank"
						leftSection={<IconUserCircle size={16} />}
					>
						{t('constants.view.profile.label')}
					</Menu.Item>
					<Menu.Item
						component="a"
						href={`mailto:${data.email}`}
						leftSection={<IconMail size={16} />}
					>
						{t('constants.actions.email.label')}
					</Menu.Item>
					<Menu.Item
						component="a"
						href={`tel:${data.phone}`}
						leftSection={<IconPhone size={16} />}
					>
						{t('constants.actions.call.label')}
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Group>
	);
};
