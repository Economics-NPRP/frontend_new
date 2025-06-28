'use client';

import { DateTime, Interval } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { AuctionCycleStatusBadge, BaseBadge } from '@/components/Badge';
import { MediumCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { IAuctionCycleData } from '@/schema/models';
import {
	ActionIcon,
	Avatar,
	Button,
	Container,
	Group,
	Skeleton,
	Stack,
	Text,
	Title,
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
	const intervalFormat = useMatches({ base: DateTime.DATE_SHORT, md: DateTime.DATE_FULL });

	// const distrbiution = useMemo(() => {
	// 	//	Generate array of 6 random values and normalize them to sum to 100
	// 	const values = new Array(6).fill(0).map(() => Math.floor(Math.random() * 100));
	// 	const sum = values.reduce((acc, val) => acc + val, 0);
	// 	const normalizedValues = values.map((val) => (val / sum) * 100);

	// 	return normalizedValues
	// 		.sort((a, b) => b - a)
	// 		.map((value, index) => (
	// 			<Progress.Section
	// 				key={index}
	// 				value={value}
	// 				color={AuctionCategoryVariants[AuctionCategoryList[index]]?.color.token}
	// 				className={`${classes[AuctionCategoryVariants[AuctionCategoryList[index]]!.color.token!]} ${classes.section}`}
	// 			>
	// 				{value > 10 && (
	// 					<Progress.Label className={classes.label}>
	// 						{t('constants.quantities.percent.default', { value })}
	// 					</Progress.Label>
	// 				)}
	// 			</Progress.Section>
	// 		));
	// }, [t]);

	const duration = useMemo(() => {
		const start = DateTime.fromISO(auctionCycleData.startDatetime);
		const end = DateTime.fromISO(auctionCycleData.endDatetime);
		const durationObject = end.diff(start).rescale().toObject();

		//	Take the largest non-zero unit for display and round it up if there are multiple units
		const unitValuePairs = Object.entries(durationObject);
		const largestUnit = unitValuePairs[0][0] as keyof typeof durationObject;
		let duration = durationObject[largestUnit] || 0;
		if (unitValuePairs.length > 1) duration += 1;
		return `${unitValuePairs.length > 1 ? '~' : ''}${duration} ${t(`components.countdown.label.long.${largestUnit}`)}`;
	}, [auctionCycleData.startDatetime, auctionCycleData.endDatetime]);

	const interval = useMemo(() => {
		const start = DateTime.fromISO(auctionCycleData.startDatetime);
		const end = DateTime.fromISO(auctionCycleData.endDatetime);
		return Interval.fromDateTimes(start, end).toLocaleString(intervalFormat);
	}, [auctionCycleData.startDatetime, auctionCycleData.endDatetime, intervalFormat]);

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
									<Title order={2} className={classes.title}>
										{auctionCycleData.title}
									</Title>
								</WithSkeleton>
								<WithSkeleton
									loading={loading}
									width={140}
									height={20}
									className="my-0.5"
								>
									<Text className={classes.subtitle}>
										{t('components.auctionCycleCard.header.subtitle', {
											value: DateTime.fromISO(
												auctionCycleData.updatedAt,
											).toRelative(),
										})}
									</Text>
								</WithSkeleton>
							</Stack>
							<Group className={classes.badges}>
								<AuctionCycleStatusBadge
									status={auctionCycleData.status}
									className={classes.badge}
									loading={loading}
								/>
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
							</Group>
						</Stack>
					</Group>
					<Stack className={classes.team}>
						<Text className={classes.label}>
							{t('components.auctionCycleCard.header.team.label')}
						</Text>
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
									<Avatar className={classes.avatar} />
									<Avatar className={classes.avatar} />
									<Avatar className={classes.avatar} />
									<Avatar className={classes.avatar} />
									<Avatar className={classes.avatar}>+5</Avatar>
								</Switch.False>
							</Switch>
						</Avatar.Group>
					</Stack>
				</Group>
				{/* <Divider className={classes.divider} />
				<Stack className={classes.statistics}>
					<Group className={classes.header}>
						<Stack className={classes.label}>
							<Text className={classes.title}>
								{t('components.auctionCycleCard.statistics.title')}
							</Text>
							<Text className={classes.subtitle}>
								{t('components.auctionCycleCard.statistics.subtitle')}
							</Text>
						</Stack>
						<Group className={classes.wrapper}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Group className={classes.value}>
								<Text className={classes.amount}>
									{format.number(auctionCycleData.emissionsCount, 'money')}
								</Text>
								<Text className={classes.unit}>
									{t('constants.emissions.unit')}
								</Text>
							</Group>
						</Group>
					</Group>
					<Progress.Root className={classes.progress}>{distrbiution}</Progress.Root>
				</Stack> */}
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
