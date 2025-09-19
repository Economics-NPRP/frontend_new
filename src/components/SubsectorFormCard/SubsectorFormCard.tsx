'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';

import { SectorBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { ISubsectorData, SectorType } from '@/schema/models';
import {
	ActionIcon,
	BoxProps,
	Checkbox,
	Container,
	Group,
	Radio,
	Skeleton,
	Stack,
	Text,
} from '@mantine/core';
import { IconPhotoHexagon, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface SubsectorFormCardProps extends Omit<BoxProps, 'type'> {
	sector: SectorType;
	subsector: Pick<ISubsectorData, 'id' | 'title' | 'description' | 'image' | 'alt'>;
	type?: 'radio' | 'checkbox' | 'readonly';
	currentSector?: SectorType;
	onClear?: () => void;
	loading?: boolean;
}
export const SubsectorFormCard = ({
	sector,
	subsector,
	type = 'checkbox',
	currentSector = sector,
	onClear,
	loading = false,
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

	useEffect(() => {
		console.log(sector, subsector, "SECTOR IN SUBSECTOR FORM CARD");
	}, [subsector])

	const finalClassName = useMemo(
		() =>
			[
				classes.root,
				className,
				type === 'readonly' ? classes.horizontal : '',
				currentSector !== sector ? classes.fade : '',
				loading ? classes.loading : '',
			].join(' '),
		[className, type, currentSector, sector, loading],
	);

	return (
		<RootElement value={`${sector}:${subsector.id}`} className={finalClassName} {...props}>
			<Stack className={classes.content}>
				<Container className={classes.image}>
					<Switch value={loading}>
						<Switch.True>
							<Container className={classes.placeholder}>
								<IconPhotoHexagon size={32} className={classes.icon} />
							</Container>
						</Switch.True>
						<Switch.False>
							<Image src={"https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop"} alt={subsector.alt} fill />
							<Container className={classes.overlay} />
						</Switch.False>
					</Switch>
				</Container>
				<Group className={classes.details}>
					<Stack className={classes.label}>
						<SectorBadge sector={sector} loading={loading} />
						<WithSkeleton loading={loading} width={180} height={28} className="my-0.5">
							<Text className={classes.title}>{subsector.title}</Text>
						</WithSkeleton>
						<Switch value={loading}>
							<Switch.True>
								<Stack className="gap-2">
									<Skeleton height={14} visible />
									<Skeleton height={14} visible />
									<Skeleton height={14} visible />
									<Skeleton height={14} visible />
								</Stack>
							</Switch.True>
							<Switch.False>
								<Text className={classes.description}>{subsector.description}</Text>
							</Switch.False>
						</Switch>
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
