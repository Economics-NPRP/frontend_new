'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { SectorBadge } from '@/components/Badge';
import { ISubsectorData, SectorType } from '@/schema/models';
import {
	ActionIcon,
	BoxProps,
	Checkbox,
	Container,
	Group,
	Radio,
	Stack,
	Text,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface SubsectorFormCardProps extends Omit<BoxProps, 'type'> {
	sector: SectorType;
	subsector: Pick<ISubsectorData, 'id' | 'title' | 'description' | 'image' | 'alt'>;
	type?: 'radio' | 'checkbox' | 'readonly';
	currentSector?: SectorType;
	onClear?: () => void;
}
export const SubsectorFormCard = ({
	sector,
	subsector,
	type = 'checkbox',
	currentSector = sector,
	onClear,
	className,
	...props
}: SubsectorFormCardProps) => {
	const RootElement = useMemo(
		() => (type === 'readonly' ? Stack : type === 'radio' ? Radio.Card : Checkbox.Card),
		[type],
	);
	const IndicatorElement = useMemo(
		() => (type === 'radio' ? Radio.Indicator : Checkbox.Indicator),
		[type],
	);

	return (
		<RootElement
			value={`${sector}:${subsector.id}`}
			className={`${classes.root} ${type === 'readonly' ? classes.horizontal : ''} ${currentSector !== sector ? classes.fade : ''} ${className}`}
			{...props}
		>
			<Stack className={classes.content}>
				<Container className={classes.image}>
					<Image src={subsector.image} alt={subsector.alt} fill />
					<Stack className={classes.overlay} />
				</Container>
				<Group className={classes.details}>
					<Stack className={classes.label}>
						<SectorBadge sector={sector} />
						<Text className={classes.title}>{subsector.title}</Text>
						<Text className={classes.description}>{subsector.description}</Text>
					</Stack>
					{type !== 'readonly' && <IndicatorElement className={classes.checkbox} />}
					{type === 'readonly' && (
						<ActionIcon className={classes.button} onClick={onClear}>
							<IconX size={16} />
						</ActionIcon>
					)}
				</Group>
			</Stack>
		</RootElement>
	);
};
