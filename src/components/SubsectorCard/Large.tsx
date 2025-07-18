import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

import { SectorData, SectorVariants } from '@/constants/SectorData';
import { ISubsectorData } from '@/schema/models';
import {
	Container,
	Group,
	Stack,
	Text,
	Title,
	UnstyledButton,
	UnstyledButtonProps,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface LargeSectorCardProps extends UnstyledButtonProps {
	subsector: ISubsectorData;
	component?: any;
	href?: string;
}
export const LargeSubsectorCard = ({ subsector, className, ...props }: LargeSectorCardProps) => {
	const t = useTranslations();

	const { Icon } = useMemo<SectorData>(
		() => SectorVariants[subsector.sector]!,
		[subsector.sector],
	);

	return (
		<UnstyledButton className={`${classes.root} ${classes.large} ${className}`} {...props}>
			<Stack className={classes.content}>
				<Container className={classes.image}>
					<Image src={subsector.image} alt={subsector.alt} fill />
					<Container className={classes.overlay} />
				</Container>
				<Group className={classes.row}>
					<Stack className={classes.label}>
						<Title className={classes.heading}>{subsector.title}</Title>
						<Text className={classes.value}>
							{t('constants.quantities.auctions.default', {
								value: Math.round(Math.random() * 100),
							})}
						</Text>
					</Stack>
					<Container className={classes.icon}>
						<IconArrowUpRight size={16} />
					</Container>
				</Group>
			</Stack>
			<Group className={`${classes.footer} ${classes[subsector.sector]}`}>
				<Icon size={14} />
				<Text className={classes.label}>
					{t(`constants.sector.${subsector.sector}.title`)}
				</Text>
			</Group>
		</UnstyledButton>
	);
};
