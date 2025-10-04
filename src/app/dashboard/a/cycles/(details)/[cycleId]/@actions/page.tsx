'use client';

import { SingleCycleContext } from 'contexts/SingleAuctionCycle';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useMemo } from 'react';

import { ActionBanner } from '@/components/ActionBanner';
import { useCycleStatus } from '@/hooks';
import { ApprovalModalContext } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/ApprovalModal';
import { Container } from '@mantine/core';
import {
	IconCirclePlus,
	IconLicense,
	IconRosetteDiscountCheck,
	IconTargetArrow,
	IconRocket,
	IconRepeat
} from '@tabler/icons-react';

import classes from './styles.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { useCycleStart } from 'hooks/useCycleStart';

export default function SubBanners() {
	const t = useTranslations();
	const { cycleId } = useParams();
	const { open } = useContext(ApprovalModalContext);
	const singleAuctionCycle = useContext(SingleCycleContext);

	useEffect(() => {
		console.log(singleAuctionCycle)
	}, [singleAuctionCycle]);

	const { isUpcoming } = useCycleStatus(singleAuctionCycle.data);

	const queryClient = useQueryClient()

	const startCycleQuery = useCycleStart((cycleId as string), () => {
		queryClient.invalidateQueries({
			queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
		});
	});

	const startCycle = () => {
		startCycleQuery.mutate();
	}

	const disabled = useMemo(
		() =>
			!isUpcoming ||
			(singleAuctionCycle.isSuccess && singleAuctionCycle.data.status !== 'draft'),
		[isUpcoming, singleAuctionCycle.isSuccess, singleAuctionCycle.data.status],
	);

	const isOngoing = useMemo(() => singleAuctionCycle.data.status === 'ongoing', [singleAuctionCycle.data.status]);

	return (
		<Container className={classes.root}>
			{/* TODO: disable actions based on current role once implemented */}
			{!disabled && 
			<>
				<ActionBanner
					className={classes.banner}
					icon={<IconCirclePlus size={32} />}
					heading={t('dashboard.admin.cycles.details.actions.create.heading')}
					subheading={t('dashboard.admin.cycles.details.actions.create.subheading')}
					component={Link}
					href={`/create/auction?cycleId=${cycleId}`}
					index={3}
					disabled={disabled}
				/>
				<ActionBanner
					className={classes.banner}
					icon={<IconLicense size={32} />}
					heading={t('dashboard.admin.cycles.details.actions.permits.heading')}
					subheading={t('dashboard.admin.cycles.details.actions.permits.subheading')}
					component={Link}
					href={`/dashboard/a/cycles/permits/${cycleId}`}
					index={4}
					disabled={disabled}
				/>
				<ActionBanner
					className={classes.banner}
					icon={<IconTargetArrow size={32} />}
					heading={t('dashboard.admin.cycles.details.actions.kpis.heading')}
					subheading={t('dashboard.admin.cycles.details.actions.kpis.subheading')}
					component={Link}
					href={`/create/cycle?id=${cycleId}`}
					index={2}
					disabled={disabled}
				/>
				<ActionBanner
					className={classes.banner}
					icon={<IconRosetteDiscountCheck size={32} />}
					heading={t('dashboard.admin.cycles.details.actions.approve.heading')}
					subheading={t('dashboard.admin.cycles.details.actions.approve.subheading')}
					index={1}
					onClick={open}
					disabled={disabled}
				/>
			</>}
			{(disabled && !isOngoing) && <ActionBanner
				className={classes.fullBanner}
				icon={<IconRocket size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.start.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.start.subheading')}
				index={1}
				onClick={startCycle}
				disabled={!disabled}
			/>}
			{
				isOngoing && <ActionBanner
					className={classes.fullBanner+" cursor-default"}
					icon={<IconRepeat size={32} />}
					heading={t('dashboard.admin.cycles.details.actions.ongoing.heading')}
					subheading={t('dashboard.admin.cycles.details.actions.ongoing.subheading')}
					index={2}
					disabled={!isOngoing}
				/>
			}
		</Container>
	);
}
