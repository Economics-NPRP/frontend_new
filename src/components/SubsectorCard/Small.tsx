import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { SectorBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { ISubsectorData } from '@/schema/models';
import { Container, Stack, Text, Title, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { IconCircleArrowRight, IconPhotoHexagon } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface SmallSubsectorCardProps extends UnstyledButtonProps {
	subsector: ISubsectorData;
	component?: any;
	href?: string;
	loading?: boolean;
}
export const SmallSubsectorCard = ({
	subsector,
	loading = false,
	className,
	...props
}: SmallSubsectorCardProps) => {
	const t = useTranslations();

	return (
		<UnstyledButton
			className={`${classes.root} ${classes.small} ${className} ${loading ? classes.loading : ''}`}
			title={subsector.title}
			{...props}
		>
			<Container className={classes.image}>
				<Switch value={loading}>
					<Switch.True>
						<Container className={classes.placeholder}>
							<IconPhotoHexagon size={32} className={classes.icon} />
						</Container>
					</Switch.True>
					<Switch.False>
						<Image src={subsector.image} alt={subsector.alt} fill />
						<Container className={classes.overlay} />
					</Switch.False>
				</Switch>
			</Container>
			<Stack className={classes.label}>
				<SectorBadge sector={subsector.sector} hideText />
				<WithSkeleton loading={loading} width={160} height={24} className="my-0.5">
					<Title className={classes.heading}>{subsector.title}</Title>
				</WithSkeleton>
				<WithSkeleton loading={loading} width={80} height={14} className="my-0.5">
					<Text className={classes.value}>
						{t('constants.quantities.auctions.default', {
							value: Math.round(Math.random() * 1000),
						})}
					</Text>
				</WithSkeleton>
				<IconCircleArrowRight className={classes.icon} size={24} />
			</Stack>
		</UnstyledButton>
	);
};
