import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { ReactNode, useMemo } from 'react';

import { SectorVariants } from '@/constants/SectorData';
import { useAuctionAvailability } from '@/hooks';
import {
	AuctionCycleStatus,
	AuctionType,
	FirmApplicationStatus,
	IAuctionData,
	SectorType,
} from '@/schema/models';
import { colors } from '@/styles/mantine';
import { ActionIcon, Badge, BadgeProps, Skeleton, Tooltip } from '@mantine/core';
import {
	IconActivity,
	IconAlarm,
	IconCalendarClock,
	IconCheck,
	IconLock,
	IconLockOpen2,
	IconPencil,
	IconTrendingDown,
	IconTrendingUp,
	IconX,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface BaseBadgeProps extends BadgeProps {
	loading?: boolean;
	withRemoveButton?: boolean;
	onRemove?: () => void;
}
export const BaseBadge = ({
	className,
	loading,
	withRemoveButton,
	onRemove,
	rightSection,
	...props
}: BaseBadgeProps) => {
	return loading ? (
		<Skeleton width={100} height={24} radius={12} visible />
	) : (
		<Badge
			className={`${classes.root} ${className}`}
			rightSection={
				rightSection ||
				(withRemoveButton && (
					<ActionIcon
						className={classes.removeButton}
						variant="transparent"
						onClick={onRemove}
					>
						<IconX size={14} />
					</ActionIcon>
				))
			}
			{...props}
		/>
	);
};

export interface AuctionTypeBadgeProps extends BaseBadgeProps {
	type: AuctionType;
	showOpen?: boolean;
}
export const AuctionTypeBadge = ({
	type,
	showOpen,
	className,
	...props
}: AuctionTypeBadgeProps) => {
	const t = useTranslations();

	return type === 'open' ? (
		showOpen ? (
			<BaseBadge
				className={`${classes.root} ${classes.auctionType} ${classes.open} ${className}`}
				variant="light"
				leftSection={<IconLockOpen2 size={14} />}
				{...props}
			>
				{t('constants.auctionType.open')}
			</BaseBadge>
		) : null
	) : (
		<BaseBadge
			className={`${classes.root} ${classes.auctionType} ${className}`}
			variant="light"
			leftSection={<IconLock size={14} />}
			{...props}
		>
			{t('constants.auctionType.sealed')}
		</BaseBadge>
	);
};

export const CurrencyBadge = ({ className, ...props }: BaseBadgeProps) => {
	const t = useTranslations();

	return (
		<BaseBadge
			className={`${classes.root} ${classes.currency} ${className}`}
			variant="light"
			{...props}
		>
			{t('constants.currency.QAR.symbol')}
		</BaseBadge>
	);
};

export interface SectorBadgeProps extends BaseBadgeProps {
	sector: SectorType;
	text?: ReactNode;
	hideText?: boolean;
}
export const SectorBadge = ({ sector, text, hideText, className, ...props }: SectorBadgeProps) => {
	const t = useTranslations();

	const Sector = useMemo(() => SectorVariants[sector.toLowerCase() as SectorType], [sector]);

	return Sector ? (
		<BaseBadge
			classNames={{
				root: `${classes.root} ${classes.sector} ${className}`,
				section: hideText ? 'm-0' : '',
			}}
			leftSection={<Sector.Icon size={14} />}
			style={{ backgroundColor: colors[Sector.color.token!][6] }}
			autoContrast
			{...props}
		>
			{!hideText &&
				(text ? text : t(`constants.sector.${sector.toLowerCase() as SectorType}.title`))}
		</BaseBadge>
	) : null;
};

export interface EndingSoonBadgeProps extends BaseBadgeProps {
	auction: IAuctionData;
}
export const EndingSoonBadge = ({ auction, className, ...props }: EndingSoonBadgeProps) => {
	const t = useTranslations();

	const { isEndingSoon } = useAuctionAvailability(auction);

	return (
		isEndingSoon && (
			<Tooltip
				label={t('constants.auctionStatus.ending.tooltip', {
					date: DateTime.fromISO(auction.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					),
				})}
			>
				<BaseBadge
					className={`${classes.root} ${classes.ending} ${className}`}
					leftSection={<IconAlarm size={14} />}
					autoContrast
					{...props}
				>
					{t('constants.auctionStatus.ending.label')}
				</BaseBadge>
			</Tooltip>
		)
	);
};

export interface FirmStatusBadgeProps extends BaseBadgeProps {
	status: FirmApplicationStatus;
}
export const FirmStatusBadge = ({ status, className, ...props }: FirmStatusBadgeProps) => {
	const t = useTranslations();

	if (status === 'approved')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.firmStatus} ${classes.verified} ${className}`}
				variant="light"
				color="green"
				{...props}
			>
				{t('constants.firmStatus.approved')}
			</BaseBadge>
		);

	if (status === 'rejected')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.firmStatus} ${classes.unverified} ${className}`}
				variant="light"
				color="red"
				{...props}
			>
				{t('constants.firmStatus.rejected')}
			</BaseBadge>
		);

	return (
		<BaseBadge
			className={`${classes.root} ${classes.firmStatus} ${classes.uninvited} ${className}`}
			variant="light"
			color="orange"
			{...props}
		>
			{t('constants.firmStatus.pending')}
		</BaseBadge>
	);
};

export interface AuctionCycleStatusBadgeProps extends BaseBadgeProps {
	status: AuctionCycleStatus;
}
export const AuctionCycleStatusBadge = ({
	status,
	className,
	...props
}: AuctionCycleStatusBadgeProps) => {
	const t = useTranslations();

	if (status === 'draft')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.auctionCycleStatus} ${classes.draft} ${className}`}
				variant="light"
				leftSection={<IconPencil size={14} />}
				{...props}
			>
				{t('constants.auctionCycleStatus.draft')}
			</BaseBadge>
		);

	if (status === 'approved')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.auctionCycleStatus} ${classes.approved} ${className}`}
				variant="light"
				color="green"
				leftSection={<IconCheck size={14} />}
				{...props}
			>
				{t('constants.auctionCycleStatus.approved')}
			</BaseBadge>
		);

	if (status === 'ongoing')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.auctionCycleStatus} ${classes.ongoing} ${className}`}
				variant="light"
				color="blue"
				leftSection={<IconActivity size={14} />}
				{...props}
			>
				{t('constants.auctionCycleStatus.ongoing')}
			</BaseBadge>
		);

	return (
		<BaseBadge
			className={`${classes.root} ${classes.auctionCycleStatus} ${classes.ended} ${className}`}
			variant="light"
			color="orange"
			leftSection={<IconAlarm size={14} />}
			{...props}
		>
			{t('constants.auctionCycleStatus.ended')}
		</BaseBadge>
	);
};

export interface TrendBadgeProps extends BaseBadgeProps {
	diff: number;
	negate?: boolean;
}
export const TrendBadge = ({ diff, negate, className, ...props }: TrendBadgeProps) => {
	const t = useTranslations();

	const adjustedDiff = useMemo(() => (negate ? -diff : diff), [diff, negate]);

	return (
		<Tooltip
			label={
				adjustedDiff >= 0
					? t('constants.trend.positive', { value: diff })
					: t('constants.trend.negative', { value: Math.abs(diff) })
			}
		>
			<BaseBadge
				className={`${classes.root} ${classes.trend} ${className}`}
				variant="light"
				color={adjustedDiff >= 0 ? 'green' : 'red'}
				leftSection={
					adjustedDiff >= 0 ? (
						<IconTrendingUp size={12} />
					) : (
						<IconTrendingDown size={12} />
					)
				}
				{...props}
			>
				{adjustedDiff >= 0
					? t('constants.trend.positive', { value: diff })
					: t('constants.trend.negative', { value: Math.abs(diff) })}
			</BaseBadge>
		</Tooltip>
	);
};

export interface AuctionStatusBadgeProps extends BaseBadgeProps {
	auctionData: IAuctionData;
}
export const AuctionStatusBadge = ({ auctionData }: AuctionStatusBadgeProps) => {
	const t = useTranslations();
	const { isUpcoming, hasEnded, isLive } = useAuctionAvailability(auctionData);

	if (isUpcoming)
		return (
			<BaseBadge
				className={classes.upcoming}
				variant="light"
				color="gray"
				leftSection={<IconCalendarClock size={14} />}
			>
				{t('constants.auctionStatus.upcoming.label')}
			</BaseBadge>
		);

	if (isLive)
		return (
			<BaseBadge
				className={classes.ongoing}
				variant="light"
				color="blue"
				leftSection={<IconActivity size={14} />}
			>
				{t('constants.auctionStatus.ongoing.label')}
			</BaseBadge>
		);

	if (hasEnded)
		return (
			<BaseBadge
				className={classes.ended}
				variant="light"
				color="orange"
				leftSection={<IconAlarm size={14} />}
			>
				{t('constants.auctionStatus.ended.label')}
			</BaseBadge>
		);

	return null;
};
