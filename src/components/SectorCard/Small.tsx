import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ComponentPropsWithRef, useMemo } from 'react';

import { SectorData, SectorVariants } from '@/constants/SectorData';
import { SectorType } from '@/schema/models';
import { Container, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconCircleArrowRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface SmallSectorCardProps extends ComponentPropsWithRef<'button'> {
	sector: SectorType;
}
export const SmallSectorCard = ({ sector, className, ...props }: SmallSectorCardProps) => {
	const t = useTranslations();

	const { image } = useMemo<SectorData>(() => SectorVariants[sector]!, [sector]);

	return (
		<UnstyledButton className={`${classes.root} ${classes.small} ${className}`} {...props}>
			<Container className={classes.image}>
				<Image src={image} alt={t(`constants.sector.${sector}.alt`)} fill />
				<Container className={classes.overlay} />
			</Container>
			<Stack className={classes.label}>
				<Title className={classes.heading}>{t(`constants.sector.${sector}.title`)}</Title>
				<Text className={classes.value}>
					{t('constants.quantities.auctions.default', {
						value: Math.round(Math.random() * 1000),
					})}
				</Text>
				<IconCircleArrowRight className={classes.icon} size={24} />
			</Stack>
		</UnstyledButton>
	);
};
