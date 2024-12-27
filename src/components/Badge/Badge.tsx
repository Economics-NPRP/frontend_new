import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { AuctionCategoryData, AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { colors } from '@/styles/mantine';
import { AuctionCategory } from '@/types';
import { Badge, BadgeProps } from '@mantine/core';

import classes from './styles.module.css';

export const CurrencyBadge = ({ ...props }: BadgeProps) => {
	return (
		<Badge className={`${classes.root} ${classes.currency}`} variant="light" {...props}>
			QAR
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
