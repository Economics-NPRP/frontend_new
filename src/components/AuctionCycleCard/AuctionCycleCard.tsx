'use client';

import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';

import { AuctionCycleStatusBadge, BaseBadge, SectorBadge } from '@/components/Badge';
import { MediumCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { useCycleStatus } from '@/hooks';
import { IAuctionCycleData } from '@/schema/models';
import {
	ActionIcon,
	Anchor,
	Avatar,
	Button,
	Container,
	Group,
	HoverCard,
	Skeleton,
	Stack,
	Text,
	useMatches,
} from '@mantine/core';
import { IconArrowUpRight, IconGavel } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionCycleCardProps {
	auctionCycleData: IAuctionCycleData;
	loading?: boolean;
}
export const AuctionCycleCard = ({
	auctionCycleData,
	loading = false,
	...props
}: AuctionCycleCardProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const truncate = useMatches({ base: false, xs: true, sm: false, md: true, lg: false });
	const { duration, interval } = useCycleStatus(auctionCycleData);

	return (
		<Group className={`${classes[auctionCycleData.status]} ${classes.root}`} {...props}>
			<Stack className={classes.left}>
				<Container className={classes.bg} />
				<Group className={classes.header}>
					<Group className={classes.wrapper}>
						<WithSkeleton loading={loading} width={4} height={64} radius={4}>
							<Container className={classes.indicator} />
						</WithSkeleton>
						<Stack className={classes.content}>
							<Stack className={classes.label}>
								<WithSkeleton
									loading={loading}
									width={160}
									height={14}
									className="my-0.5"
								>
									<Id
										variant="auctionCycle"
										value={auctionCycleData.id}
										truncate={truncate}
										className={classes.id}
									/>
								</WithSkeleton>
								<WithSkeleton
									loading={loading}
									width={240}
									height={36}
									className="my-0.5"
								>
									<Anchor
										component={Link}
										href={`/dashboard/a/cycles/${auctionCycleData.id}`}
										className={classes.title}
									>
										{auctionCycleData.title}
									</Anchor>
								</WithSkeleton>
								<WithSkeleton
									loading={loading}
									width={140}
									height={20}
									className="my-0.5"
								>
									<Text className={classes.subtitle}>
										{auctionCycleData.description}
									</Text>
								</WithSkeleton>
							</Stack>
							<Group className={classes.badges}>
								<AuctionCycleStatusBadge
									status={auctionCycleData.status}
									className={classes.badge}
									loading={loading}
								/>
								{auctionCycleData.sectors.map((sector) => (
									<SectorBadge
										key={sector}
										sector={sector}
										className={classes.badge}
										loading={loading}
									/>
								))}
								<BaseBadge
									variant="light"
									className={`${classes.basic} ${classes.badge}`}
									loading={loading}
								>
									{duration}
								</BaseBadge>
								<BaseBadge
									variant="light"
									className={`${classes.basic} ${classes.badge}`}
									loading={loading}
								>
									{interval}
								</BaseBadge>
								<BaseBadge
									variant="light"
									className={`${classes.basic} ${classes.badge}`}
									loading={loading}
								>
									{t('constants.lastUpdated', {
										value: DateTime.fromISO(
											auctionCycleData.updatedAt,
										).toRelative(),
									})}
								</BaseBadge>
							</Group>
						</Stack>
					</Group>
					<Stack className={classes.team}>
						<Text className={classes.label}>
							{t('components.auctionCycleCard.header.team.label')}
						</Text>
						<HoverCard position="top" withinPortal={false}>
							<HoverCard.Target>
								<Avatar.Group>
									<Switch value={loading}>
										<Switch.True>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
										</Switch.True>
										<Switch.False>
											{auctionCycleData.adminAssignments
												.slice(0, 3)
												.map((admin) => (
													<Avatar
														key={admin.adminId}
														className={classes.avatar}
														color="initials"
														name={admin.admin.name}
													/>
												))}
											{auctionCycleData.adminAssignments.length > 3 && (
												<Avatar className={classes.avatar}>
													+{auctionCycleData.assignedAdminsCount - 3}
												</Avatar>
											)}
										</Switch.False>
									</Switch>
								</Avatar.Group>
							</HoverCard.Target>
							<HoverCard.Dropdown className={classes.dropdown}>
								{auctionCycleData.adminAssignments.map((admin) => (
									<Group key={admin.adminId} className={classes.row}>
										<Avatar
											className={classes.avatar}
											color="initials"
											name={admin.admin.name}
											size="sm"
										/>
										<Anchor
											className={classes.name}
											href={`/dashboard/a/admins/${admin.adminId}`}
										>
											{admin.admin.name}
										</Anchor>
									</Group>
								))}
							</HoverCard.Dropdown>
						</HoverCard>
					</Stack>
				</Group>
			</Stack>
			<Group className={classes.right}>
				<Group className={classes.properties}>
					<Stack className={classes.cell}>
						<Text className={classes.label}>
							{t('components.auctionCycleCard.properties.numberAuctions.label')}
						</Text>
						<Group className={classes.row}>
							<Container className={classes.icon}>
								<IconGavel size={16} />
							</Container>
							<WithSkeleton loading={loading} width={100} height={32} data-dark>
								<Text className={classes.value}>
									{format.number(auctionCycleData.auctionsCount)}
								</Text>
								<Text className={classes.unit}>
									{t('constants.quantities.auctions.unitOnly', {
										value: auctionCycleData.auctionsCount,
									})}
								</Text>
							</WithSkeleton>
						</Group>
					</Stack>
					<Stack className={classes.cell}>
						<Switch value={auctionCycleData.status}>
							<Switch.Case when="ongoing">
								<Text className={classes.label}>
									{t('constants.auctionStatus.endingIn.label')}
								</Text>
							</Switch.Case>
							<Switch.Case when="ended">
								<Text className={classes.label}>
									{t('constants.auctionStatus.ended.label')}
								</Text>
							</Switch.Case>
							<Switch.Else>
								<Text className={classes.label}>
									{t('constants.auctionStatus.startingIn.label')}
								</Text>
							</Switch.Else>
						</Switch>
						<MediumCountdown
							targetDate={
								['ongoing', 'ended'].includes(auctionCycleData.status)
									? auctionCycleData.endDatetime
									: auctionCycleData.startDatetime
							}
							loading={loading}
							data-dark
						/>
					</Stack>
				</Group>
				<Button
					className={classes.button}
					//	@ts-expect-error - component cannot accept either component or string
					component={loading ? 'button' : Link}
					href={`/dashboard/a/cycles/${auctionCycleData.id}`}
					rightSection={<IconArrowUpRight size={16} />}
					hiddenFrom="sm"
					loading={loading}
				>
					{t('constants.view.details.label')}
				</Button>
				<ActionIcon
					className={classes.button}
					//	@ts-expect-error - component cannot accept either component or string
					component={loading ? 'button' : Link}
					href={`/dashboard/a/cycles/${auctionCycleData.id}`}
					visibleFrom="sm"
					loading={loading}
				>
					<IconArrowUpRight size={24} />
				</ActionIcon>
			</Group>
		</Group>
	);
};

export const HomeAuctionCycleCard = ({
	auctionCycleData,
	loading = false,
	...props
}: AuctionCycleCardProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const truncate = useMatches({ base: false, xs: true, sm: false, md: true, lg: false });
	const { duration, interval } = useCycleStatus(auctionCycleData);

	return (
		<Group className={`${classes[auctionCycleData.status]} ${classes.root} ${classes.home}`} {...props}>
			<Stack className={classes.left}>
				<Text className={classes.heading}>{t('components.auctionCycleCard.header.title')}</Text>
				<Container className={classes.bg} />
				<Group className={classes.header}>
					<Group className={classes.wrapper}>
						<WithSkeleton loading={loading} width={4} height={64} radius={4}>
							<Container className={classes.indicator} />
						</WithSkeleton>
						<Stack className={classes.content}>
							<Stack className={classes.label}>
								<WithSkeleton
									loading={loading}
									width={160}
									height={14}
									className="my-0.5"
								>
									<Id
										variant="auctionCycle"
										value={auctionCycleData.id}
										truncate={truncate}
										className={classes.id}
									/>
								</WithSkeleton>
								<WithSkeleton
									loading={loading}
									width={240}
									height={36}
									className="my-0.5"
								>
									<Anchor
										component={Link}
										href={`/dashboard/a/cycles/${auctionCycleData.id}`}
										className={classes.title}
									>
										{auctionCycleData.title}
									</Anchor>
								</WithSkeleton>
								<WithSkeleton
									loading={loading}
									width={140}
									height={20}
									className="my-0.5"
								>
									<Text className={classes.subtitle}>
										{auctionCycleData.description}
									</Text>
								</WithSkeleton>
							</Stack>
							<Group className={classes.badges}>
								<AuctionCycleStatusBadge
									status={auctionCycleData.status}
									className={classes.badge}
									loading={loading}
								/>
								{auctionCycleData.sectors.map((sector) => (
									<SectorBadge
										key={sector}
										sector={sector}
										className={classes.badge}
										loading={loading}
									/>
								))}
							</Group>
						</Stack>
					</Group>
					<Stack className={classes.team}>
						<Text className={classes.label}>
							{t('components.auctionCycleCard.header.team.label')}
						</Text>
						<HoverCard position="top" withinPortal={false}>
							<HoverCard.Target>
								<Avatar.Group>
									<Switch value={loading}>
										<Switch.True>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
											<Skeleton
												visible
												width={38}
												height={38}
												circle
												className="-ml-3"
											/>
										</Switch.True>
										<Switch.False>
											{auctionCycleData.adminAssignments
												.slice(0, 3)
												.map((admin) => (
													<Avatar
														key={admin.adminId}
														className={classes.avatar}
														color="initials"
														name={admin.admin.name}
													/>
												))}
											{auctionCycleData.adminAssignments.length > 3 && (
												<Avatar className={classes.avatar}>
													+{auctionCycleData.assignedAdminsCount - 3}
												</Avatar>
											)}
										</Switch.False>
									</Switch>
								</Avatar.Group>
							</HoverCard.Target>
							<HoverCard.Dropdown className={classes.dropdown}>
								{auctionCycleData.adminAssignments.map((admin) => (
									<Group key={admin.adminId} className={classes.row}>
										<Avatar
											className={classes.avatar}
											color="initials"
											name={admin.admin.name}
											size="sm"
										/>
										<Anchor
											className={classes.name}
											href={`/dashboard/a/admins/${admin.adminId}`}
										>
											{admin.admin.name}
										</Anchor>
									</Group>
								))}
							</HoverCard.Dropdown>
						</HoverCard>
					</Stack>
				</Group>
			</Stack>
			<Text className={classes.date}><strong>{t('constants.endsAt')}</strong>{
				DateTime.fromISO(
					auctionCycleData.endDatetime,
				).toLocaleString(DateTime.DATETIME_MED).split(",").slice(0, 2).join(",")
			}</Text>
		</Group>
	);
};