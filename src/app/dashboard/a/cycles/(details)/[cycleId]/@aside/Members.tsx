'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { IAdminData } from '@/schema/models';
import { ActionIcon, Avatar, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { IconDots, IconInfoCircle, IconMail, IconPhone, IconUserCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const MembersContent = () => {
	const t = useTranslations();

	return (
		<Stack className={`${classes.members} ${classes.root}`}>
			<MemberSection
				//	TODO: move role names to different key in en.json (constants.adminRoles)
				title={t('create.cycle.second.manager.heading')}
				description={t('create.cycle.second.manager.subheading')}
				members={[
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
				]}
			/>
			<MemberSection
				title={t('create.cycle.second.operator.heading')}
				description={t('create.cycle.second.operator.subheading')}
				members={[
					{
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
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
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
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
					{
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person D',
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
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person E',
						email: 'test@gmail.com',
						phone: '12345678',
						type: 'admin',
						createdAt: DateTime.now().toISO(),
						emailVerified: true,
						phoneVerified: true,
						isActive: true,
						isSuperadmin: true,
					},
				]}
			/>
			<MemberSection
				title={t('create.cycle.second.allocator.heading')}
				description={t('create.cycle.second.allocator.subheading')}
				members={[
					{
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person F',
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
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person G',
						email: 'test@gmail.com',
						phone: '12345678',
						type: 'admin',
						createdAt: DateTime.now().toISO(),
						emailVerified: true,
						phoneVerified: true,
						isActive: true,
						isSuperadmin: true,
					},
				]}
			/>
			<MemberSection
				title={t('create.cycle.second.auditor.heading')}
				description={t('create.cycle.second.auditor.subheading')}
				members={[
					{
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person H',
						email: 'test@gmail.com',
						phone: '12345678',
						type: 'admin',
						createdAt: DateTime.now().toISO(),
						emailVerified: true,
						phoneVerified: true,
						isActive: true,
						isSuperadmin: true,
					},
				]}
			/>
			<MemberSection
				title={t('create.cycle.second.finance.heading')}
				description={t('create.cycle.second.finance.subheading')}
				members={[
					{
						id: 'a523474c-af06-45af-ae30-04092a61d94c',
						name: 'Person I',
						email: 'test@gmail.com',
						phone: '12345678',
						type: 'admin',
						createdAt: DateTime.now().toISO(),
						emailVerified: true,
						phoneVerified: true,
						isActive: true,
						isSuperadmin: true,
					},
				]}
			/>
		</Stack>
	);
};

interface MemberSectionProps {
	title: string;
	description: string;
	members: Array<IAdminData>;
}
const MemberSection = ({ title, description, members }: MemberSectionProps) => {
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
			{members.map((member) => (
				<MemberCard key={member.id} data={member} />
			))}
		</Stack>
	);
};

interface MemberCardProps {
	data: IAdminData;
}
export const MemberCard = ({ data }: MemberCardProps) => {
	const t = useTranslations();

	return (
		<Group className={classes.card}>
			<Avatar color="initials" name={data.name} />
			<Stack className={classes.label}>
				<Text className={classes.name}>{data.name}</Text>
				<Text className={classes.meta}>
					{t('constants.lastOnline.default', {
						value: DateTime.now()
							.minus({ hours: Math.random() * 12 })
							.toRelative(),
					})}
				</Text>
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
