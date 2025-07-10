import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

import { SectorVariants } from '@/constants/SectorData';
import { SectorType } from '@/schema/models';
import { Checkbox, CheckboxCardProps, Container, Group, Radio, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export interface SectorFormCardProps extends Omit<CheckboxCardProps, 'type'> {
	sector: SectorType;
	type?: 'radio' | 'checkbox';
}
export const SectorFormCard = ({
	sector,
	type = 'checkbox',
	className,
	...props
}: SectorFormCardProps) => {
	const t = useTranslations();

	const sectorData = useMemo(() => SectorVariants[sector]!, [sector]);

	const RootElement = useMemo(() => (type === 'radio' ? Radio.Card : Checkbox.Card), [type]);
	const IndicatorElement = useMemo(
		() => (type === 'radio' ? Radio.Indicator : Checkbox.Indicator),
		[type],
	);

	return (
		<RootElement value={sector} className={`${classes.root} ${className}`} {...props}>
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
							{t(`constants.sector.${sector}.title`)}
						</Text>
						<Text className={classes.description}>
							{t(`constants.sector.${sector}.description.register`)}
						</Text>
					</Stack>
					<IndicatorElement color={sectorData.color.token} className={classes.checkbox} />
				</Group>
			</Stack>
		</RootElement>
	);
};
