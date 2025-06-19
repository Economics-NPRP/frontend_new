import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { useAuctionAvailability } from '@/hooks';
import { AuctionType, IAuctionData } from '@/schema/models';
import { colors } from '@/styles/mantine';
import { AuctionCategory } from '@/types';
import { ActionIcon, Badge, BadgeProps, Skeleton, Tooltip } from '@mantine/core';
import { IconAlarm, IconLock, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

interface BaseBadgeProps extends BadgeProps {
	loading?: boolean;
	withRemoveButton?: boolean;
	onRemove?: () => void;
}
const BaseBadge = ({
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
	//	TODO: replace with actual firm status type from types folder
	status: 'verified' | 'unverified' | 'uninvited';
}
export const FirmStatusBadge = ({ status, className, ...props }: FirmStatusBadgeProps) => {
	const t = useTranslations();

	if (status === 'verified')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.firmStatus} ${classes.verified} ${className}`}
				variant="light"
				color="green"
				{...props}
			>
				{t('constants.firmStatus.verified')}
			</BaseBadge>
		);

	if (status === 'unverified')
		return (
			<BaseBadge
				className={`${classes.root} ${classes.firmStatus} ${classes.unverified} ${className}`}
				variant="light"
				color="orange"
				{...props}
			>
				{t('constants.firmStatus.unverified')}
			</BaseBadge>
		);

	return (
		<BaseBadge
			className={`${classes.root} ${classes.firmStatus} ${classes.uninvited} ${className}`}
			variant="light"
			{...props}
		>
			{t('constants.firmStatus.uninvited')}
		</BaseBadge>
	);
};
