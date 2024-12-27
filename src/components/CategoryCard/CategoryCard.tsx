import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ComponentPropsWithRef, useMemo } from 'react';

import { AuctionCategory } from '@/types';
import { Container, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconCircleArrowRight } from '@tabler/icons-react';

import { CategoryData, CategoryVariants } from './constants';
import classes from './styles.module.css';

export interface CategoryCardProps extends ComponentPropsWithRef<'button'> {
	category: AuctionCategory;
}
export const CategoryCard = ({ category, className, ...props }: CategoryCardProps) => {
	const t = useTranslations();

	const { image } = useMemo<CategoryData>(() => CategoryVariants[category]!, [category]);

	return (
		<UnstyledButton className={`${classes.root} ${className}`} {...props}>
			<Container className={classes.image}>
				<Image src={image} alt={t(`constants.auctionCategory.${category}.alt`)} fill />
				<Container className={classes.overlay} />
			</Container>
			<Stack className={classes.label}>
				<Title className={classes.heading}>
					{t(`constants.auctionCategory.${category}.title`)}
				</Title>
				<Text className={classes.value}>
					{t('components.categoryCard.value', {
						value: Math.round(Math.random() * 1000),
					})}
				</Text>
				<IconCircleArrowRight className={classes.icon} size={24} />
			</Stack>
		</UnstyledButton>
	);
};
