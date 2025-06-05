import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
	AuctionCategoryData,
	AuctionCategoryVariants,
	ENDING_SOON_THRESHOLD,
} from '@/constants/AuctionCategory';
import { AuctionType, IAuctionData } from '@/schema/models';
import { colors } from '@/styles/mantine';
import { AuctionCategory } from '@/types';
import { Badge, BadgeProps, Tooltip } from '@mantine/core';
import { IconAlarm, IconLock, IconLockOpen } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionTypeBadgeProps extends BadgeProps {
	type: AuctionType;
}
export const AuctionTypeBadge = ({ type, className, ...props }: AuctionTypeBadgeProps) => {
	const t = useTranslations();

	return (
		<Badge
			className={`${classes.root} ${classes.auctionType} ${className}`}
			variant="light"
			leftSection={type === 'open' ? <IconLockOpen size={14} /> : <IconLock size={14} />}
			{...props}
		>
			{t(`constants.auctionType.${type}`)}
		</Badge>
	);
};

export const CurrencyBadge = ({ className, ...props }: BadgeProps) => {
	const t = useTranslations();

	return (
		<Badge
			className={`${classes.root} ${classes.currency} ${className}`}
			variant="light"
			{...props}
		>
			{t('constants.currency.QAR.symbol')}
		</Badge>
	);
};

export interface CategoryBadgeProps extends BadgeProps {
	category: AuctionCategory;
}
export const CategoryBadge = ({ category, className, ...props }: CategoryBadgeProps) => {
	const t = useTranslations();

	const { Icon, color } = useMemo<AuctionCategoryData>(
		() => AuctionCategoryVariants[category]!,
		[category],
	);

	return (
		<Badge
			className={`${classes.root} ${classes.category} ${className}`}
			leftSection={<Icon size={14} />}
			style={{ backgroundColor: colors[color.token!][6] }}
			autoContrast
			{...props}
		>
			{t(`constants.auctionCategory.${category}.title`)}
		</Badge>
	);
};

export interface EndingSoonBadgeProps extends BadgeProps, Pick<IAuctionData, 'endDatetime'> {}
export const EndingSoonBadge = ({ endDatetime, className, ...props }: EndingSoonBadgeProps) => {
	const t = useTranslations();

	const isEndingSoon = useMemo(
		() =>
			DateTime.fromISO(endDatetime).diffNow().milliseconds > 0 &&
			DateTime.fromISO(endDatetime).diffNow().milliseconds < ENDING_SOON_THRESHOLD,
		[endDatetime],
	);

	return (
		isEndingSoon && (
			<Tooltip
				label={t('constants.auctionStatus.ending.tooltip', {
					date: DateTime.fromISO(endDatetime).toLocaleString(DateTime.DATETIME_FULL),
				})}
			>
				<Badge
					className={`${classes.root} ${classes.ending} ${className}`}
					leftSection={<IconAlarm size={14} />}
					autoContrast
					{...props}
				>
					{t('constants.auctionStatus.ending.label')}
				</Badge>
			</Tooltip>
		)
	);
};
