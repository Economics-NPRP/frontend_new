import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { SectorData, SectorVariants } from '@/constants/SectorData';
import { SectorType } from '@/schema/models';
import { Container, Stack, Text, Title, UnstyledButton, UnstyledButtonProps } from '@mantine/core';

import classes from './styles.module.css';

export default function Grid() {
	return (
		<Container className={classes.root}>
			<SectorCard sector="energy" />
			<SectorCard sector="industry" />
			<SectorCard sector="transport" />
			<SectorCard sector="buildings" />
			<SectorCard sector="agriculture" />
			<SectorCard sector="waste" />
		</Container>
	);
}

interface SectorCardProps extends UnstyledButtonProps {
	sector: SectorType;
}
const SectorCard = ({ sector, className, ...props }: SectorCardProps) => {
	const t = useTranslations();

	const { image, Icon } = useMemo<SectorData>(() => SectorVariants[sector]!, [sector]);

	return (
		<UnstyledButton
			className={`${classes.card} ${className}`}
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
					{t('constants.quantities.subsectors.default', {
						value: Math.round(Math.random() * 20),
					})}
				</Text>
			</Stack>
		</UnstyledButton>
	);
};
