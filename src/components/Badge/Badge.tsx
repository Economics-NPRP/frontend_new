import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { AuctionCategoryData, AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { AuctionType } from '@/schema/models';
import { colors } from '@/styles/mantine';
import { AuctionCategory } from '@/types';
import { Badge, BadgeProps } from '@mantine/core';
import { IconLock, IconLockOpen } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionTypeBadgeProps extends BadgeProps {
	type: AuctionType;
}
export const AuctionTypeBadge = ({ type, ...props }: AuctionTypeBadgeProps) => {
	const t = useTranslations();

	return (
		<Badge
			className={`${classes.root} ${classes.auctionType}`}
			variant="light"
			leftSection={type === 'open' ? <IconLockOpen size={14} /> : <IconLock size={14} />}
			{...props}
		>
			{t(`constants.auctionType.${type}`)}
		</Badge>
	);
};

export const CurrencyBadge = ({ ...props }: BadgeProps) => {
	const t = useTranslations();

	return (
		<Badge className={`${classes.root} ${classes.currency}`} variant="light" {...props}>
			{t('constants.currency.QAR.symbol')}
		</Badge>
	);
};

export interface CategoryBadgeProps extends BadgeProps {
	category: AuctionCategory;
}
export const CategoryBadge = ({ category, ...props }: CategoryBadgeProps) => {
	const t = useTranslations();

	const { Icon, color } = useMemo<AuctionCategoryData>(
		() => AuctionCategoryVariants[category]!,
		[category],
	);

	return (
		<Badge
			className={`${classes.root} ${classes.category}}`}
			leftSection={<Icon size={14} />}
			style={{ backgroundColor: colors[color.token!][6] }}
			autoContrast
			{...props}
		>
			{t(`constants.auctionCategory.${category}.title`)}
		</Badge>
	);
};
