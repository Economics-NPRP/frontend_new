import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { AuctionCategory } from '@/types';
import { Checkbox, CheckboxCardProps, Container, Group, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export interface SectorCardProps extends CheckboxCardProps {
	sector: AuctionCategory;
}
export const SectorCard = ({ sector, ...props }: SectorCardProps) => {
	const t = useTranslations();

	const sectorData = useMemo(() => AuctionCategoryVariants[sector]!, [sector]);

	return (
		<Checkbox.Card value={sector} className={classes.root} {...props}>
			<Stack className={classes.content}>
				<Container className={classes.image}>
					<Image src={sectorData.image} alt={'Image of a power plant'} fill />
					<Stack className={classes.overlay} />
				</Container>
				<Group className={classes.details}>
					<Stack className={classes.label}>
						<Container className={classes.icon}>
							<sectorData.Icon size={20} />
						</Container>
						<Text className={classes.title}>
							{t(`constants.auctionCategory.${sector}.title`)}
						</Text>
						<Text className={classes.description}>
							{t(`constants.auctionCategory.${sector}.description.register`)}
						</Text>
					</Stack>
					<Checkbox.Indicator
						color={sectorData.color.token}
						className={classes.checkbox}
					/>
				</Group>
			</Stack>
		</Checkbox.Card>
	);
};
