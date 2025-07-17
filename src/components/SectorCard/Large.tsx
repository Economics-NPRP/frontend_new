import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { SectorData, SectorVariants } from '@/constants/SectorData';
import { SectorType } from '@/schema/models';
import { Container, Stack, Text, Title, UnstyledButton, UnstyledButtonProps } from '@mantine/core';

import classes from './styles.module.css';

export interface LargeSectorCardProps extends UnstyledButtonProps {
	sector: SectorType;
	unit: 'auctions' | 'subsectors';
}
export const LargeSectorCard = ({ sector, unit, className, ...props }: LargeSectorCardProps) => {
	const t = useTranslations();

	const { image, Icon } = useMemo<SectorData>(() => SectorVariants[sector]!, [sector]);

	return (
		<UnstyledButton
			className={`${classes.root} ${classes.large} ${className}`}
			component={Link}
			href={`/dashboard/a/cycles/sectors/${sector}`}
			{...props}
		>
			<Container className={classes.image}>
				<Image src={image} alt={t(`constants.sector.${sector}.alt`)} fill />
				<Container className={classes.overlay} />
			</Container>
			<Stack className={classes.label}>
				<Container className={classes.icon}>
					<Icon size={16} />
				</Container>
				<Title className={classes.heading}>{t(`constants.sector.${sector}.title`)}</Title>
				<Text className={classes.value}>
					{t(`constants.quantities.${unit}.default`, {
						value: Math.round(Math.random() * 100),
					})}
				</Text>
			</Stack>
		</UnstyledButton>
	);
};
