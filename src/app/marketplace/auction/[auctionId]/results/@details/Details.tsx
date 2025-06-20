import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import { AuctionTypeBadge, CategoryBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { SingleAuctionContext } from '@/contexts';
import {
	Anchor,
	Avatar,
	Breadcrumbs,
	Container,
	Group,
	Skeleton,
	Stack,
	Title,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Details = () => {
	const auction = useContext(SingleAuctionContext);

	return (
		<Group className={classes.details}>
			<Container className={classes.image}>
				<Image
					src={auction.data.image || '/imgs/industry/flare.jpg'}
					alt={'Image of a power plant'}
					fill
				/>
			</Container>
			<Stack className={classes.content}>
				<Switch value={auction.isLoading}>
					<Switch.True>
						<Breadcrumbs
							separator={<IconChevronRight size={14} />}
							classNames={{
								root: classes.breadcrumbs,
								separator: classes.separator,
							}}
						>
							<Skeleton width={80} height={14} visible />
							<Skeleton width={80} height={14} visible />
							<Skeleton width={80} height={14} visible />
						</Breadcrumbs>
					</Switch.True>
					<Switch.False>
						<Breadcrumbs
							separator={<IconChevronRight size={14} />}
							classNames={{
								root: classes.breadcrumbs,
								separator: classes.separator,
							}}
						>
							<Anchor component={Link} href="/marketplace">
								Marketplace
							</Anchor>
							{/* TODO: change links once sectors are implemented in marketplace */}
							<Anchor component={Link} href="/marketplace">
								Industry
							</Anchor>
							<Anchor component={Link} href="/marketplace">
								Flare Gas Burning
							</Anchor>
						</Breadcrumbs>
					</Switch.False>
				</Switch>
				<WithSkeleton loading={auction.isLoading} width={360} height={40}>
					<Title className={classes.title}>Flare Gas Burning</Title>
				</WithSkeleton>
				<Group className={classes.badges}>
					<CategoryBadge category={'industry'} loading={auction.isLoading} />
					<AuctionTypeBadge type={auction.data.type} loading={auction.isLoading} />
				</Group>
				<Group className={classes.row}>
					<Group className={classes.owner}>
						<WithSkeleton loading={auction.isLoading} width={40} height={40} circle>
							<Avatar
								className={classes.avatar}
								name={auction.data.owner && auction.data.owner.name}
							/>
						</WithSkeleton>
						<WithSkeleton loading={auction.isLoading} width={160} height={24}>
							<Anchor
								component={Link}
								className={classes.link}
								href={`/marketplace/firm/${auction.data.ownerId}`}
							>
								{auction.data.owner && auction.data.owner.name}
							</Anchor>
						</WithSkeleton>
					</Group>
					<WithSkeleton loading={auction.isLoading} width={260} height={14}>
						<Id className={classes.id} value={auction.data.id} variant="industry" />
					</WithSkeleton>
				</Group>
			</Stack>
		</Group>
	);
};
