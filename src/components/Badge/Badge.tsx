import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { useAuctionAvailability } from '@/hooks';
import {
	AuctionCycleStatus,
	AuctionType,
	FirmApplicationStatus,
	IAuctionData,
} from '@/schema/models';
import { colors } from '@/styles/mantine';
import { AuctionCategory } from '@/types';
import { ActionIcon, Badge, BadgeProps, Skeleton, Tooltip } from '@mantine/core';
import {
	IconActivity,
	IconAlarm,
	IconCheck,
	IconLock,
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
}
export const AuctionTypeBadge = ({ type, className, ...props }: AuctionTypeBadgeProps) => {
	const t = useTranslations();

	return type === 'open' ? null : (
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

export interface CategoryBadgeProps extends BaseBadgeProps {
	category: AuctionCategory;
}
export const CategoryBadge = ({ category, className, ...props }: CategoryBadgeProps) => {
	const t = useTranslations();

	const AuctionCategory = useMemo(
		() => AuctionCategoryVariants[category.toLowerCase() as AuctionCategory],
		[category],
	);

	return AuctionCategory ? (
		<BaseBadge
			className={`${classes.root} ${classes.category} ${className}`}
			leftSection={<AuctionCategory.Icon size={14} />}
			style={{ backgroundColor: colors[AuctionCategory.color.token!][6] }}
			autoContrast
			{...props}
		>
			{t(`constants.auctionCategory.${category.toLowerCase() as AuctionCategory}.title`)}
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
		<BaseBadge
			className={`${classes.root} ${classes.trend} ${className}`}
			variant="light"
			color={adjustedDiff >= 0 ? 'green' : 'red'}
			leftSection={
				adjustedDiff >= 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />
			}
			{...props}
		>
			{adjustedDiff >= 0
				? t('constants.trend.positive', { value: diff })
				: t('constants.trend.negative', { value: Math.abs(diff) })}
		</BaseBadge>
	);
};
