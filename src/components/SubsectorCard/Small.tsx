import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { SectorBadge } from '@/components/Badge';
import { ISubsectorData } from '@/schema/models';
import { Container, Stack, Text, Title, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { IconCircleArrowRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface SmallSubsectorCardProps extends UnstyledButtonProps {
	subsector: ISubsectorData;
	component?: any;
	href?: string;
}
export const SmallSubsectorCard = ({ subsector, className, ...props }: SmallSubsectorCardProps) => {
	const t = useTranslations();

	return (
		<UnstyledButton className={`${classes.root} ${classes.small} ${className}`} {...props}>
			<Container className={classes.image}>
				<Image src={subsector.image} alt={subsector.alt} fill />
				<Container className={classes.overlay} />
			</Container>
			<Stack className={classes.label}>
				<SectorBadge sector={subsector.sector} hideText />
				<Title className={classes.heading}>{subsector.title}</Title>
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
