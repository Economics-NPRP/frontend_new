'use client';

import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { AuctionCycleStatusBadge, BaseBadge } from '@/components/Badge';
import { MediumCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { IAuctionCycleData } from '@/schema/models';
import {
	ActionIcon,
	Avatar,
	Container,
	Divider,
	Group,
	Progress,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { IconArrowUpRight, IconGavel } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionCycleCardProps {
	auctionCycleData: IAuctionCycleData;
}
export const AuctionCycleCard = ({ auctionCycleData }: AuctionCycleCardProps) => {
	const t = useTranslations();

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
		return Interval.fromDateTimes(start, end).toLocaleString(DateTime.DATE_FULL);
	}, [auctionCycleData.startDatetime, auctionCycleData.endDatetime]);

	return (
		<Group className={`${classes[auctionCycleData.status]} ${classes.root}`}>
			<Stack className={classes.left}>
				<Container className={classes.bg} />
				<Group className={classes.header}>
					<Group className={classes.wrapper}>
						<Container className={classes.indicator} />
						<Stack className={classes.content}>
							<Stack className={classes.label}>
								<Id variant="auctionCycle" value={auctionCycleData.id} />
								<Title order={2} className={classes.title}>
									{auctionCycleData.title}
								</Title>
								<Text className={classes.subtitle}>
									{t('components.auctionCycleCard.header.subtitle', {
										value: DateTime.fromISO(
											auctionCycleData.updatedAt,
										).toRelative(),
									})}
								</Text>
							</Stack>
							<Group className={classes.badges}>
								<AuctionCycleStatusBadge
									status={auctionCycleData.status}
									className={classes.badge}
								/>
								<BaseBadge
									variant="light"
									className={`${classes.basic} ${classes.badge}`}
								>
									{duration}
								</BaseBadge>
								<BaseBadge
									variant="light"
									className={`${classes.basic} ${classes.badge}`}
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
							<Avatar />
							<Avatar />
							<Avatar />
							<Avatar />
							<Avatar>+5</Avatar>
						</Avatar.Group>
					</Stack>
				</Group>
				<Divider className={classes.divider} />
				<Stack className={classes.statistics}>
					<Progress.Root className={classes.progress}>
						<Progress.Section value={59}></Progress.Section>
						<Progress.Section value={35}></Progress.Section>
						<Progress.Section value={6}></Progress.Section>
					</Progress.Root>
				</Stack>
			</Stack>
			<Group className={classes.right}>
				<Stack className={classes.properties}>
					<Stack className={classes.cell}>
						<Text className={classes.label}>
							{t('components.auctionCycleCard.properties.numberAuctions.label')}
						</Text>
						<Group className={classes.row}>
							<Container className={classes.icon}>
								<IconGavel size={16} />
							</Container>
							<Text className={classes.value}>{auctionCycleData.auctionsCount}</Text>
							<Text className={classes.unit}>
								{t('constants.quantities.auctions.unitOnly', {
									value: auctionCycleData.auctionsCount,
								})}
							</Text>
						</Group>
					</Stack>
					<Divider className={classes.divider} />
					<Stack className={classes.cell}>
						<Switch value={auctionCycleData.status}>
							<Switch.Case when="ongoing">
								<Text className={classes.label}>
									{t('constants.auctionStatus.endingIn.label')}
								</Text>
								<MediumCountdown
									targetDate={auctionCycleData.endDatetime}
									data-dark
								/>
							</Switch.Case>
							<Switch.Case when="ongoing">
								<Text className={classes.label}>
									{t('constants.auctionStatus.ended.label')}
								</Text>
								<MediumCountdown
									targetDate={auctionCycleData.endDatetime}
									data-dark
								/>
							</Switch.Case>
							<Switch.Else>
								<Text className={classes.label}>
									{t('constants.auctionStatus.startingIn.label')}
								</Text>
								<MediumCountdown
									targetDate={auctionCycleData.startDatetime}
									data-dark
								/>
							</Switch.Else>
						</Switch>
					</Stack>
				</Stack>
				<Divider orientation="vertical" className={classes.divider} />
				<ActionIcon
					className={classes.button}
					component={Link}
					href={`/dashboard/a/cycles/${auctionCycleData.id}`}
				>
					<IconArrowUpRight size={24} />
				</ActionIcon>
			</Group>
		</Group>
	);
};
