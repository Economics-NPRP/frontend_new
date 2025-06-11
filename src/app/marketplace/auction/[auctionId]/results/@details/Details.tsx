import Image from 'next/image';
import { useContext } from 'react';

import { AuctionTypeBadge, CategoryBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { SingleAuctionContext } from '@/contexts';
import { Anchor, Avatar, Breadcrumbs, Container, Group, Stack, Title } from '@mantine/core';
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
				<Breadcrumbs
					separator={<IconChevronRight size={14} />}
					classNames={{
						root: classes.breadcrumbs,
						separator: classes.separator,
					}}
				>
					<Anchor href="/marketplace">Marketplace</Anchor>
					<Anchor>Industry</Anchor>
					<Anchor>Flare Gas Burning</Anchor>
				</Breadcrumbs>
				<Title className={classes.title}>Flare Gas Burning</Title>
				<Group className={classes.badges}>
					<CategoryBadge category={'industry'} />
					<AuctionTypeBadge type={auction.data.type} />
				</Group>
				<Group className={classes.row}>
					<Group className={classes.owner}>
						<Avatar
							className={classes.avatar}
							name={auction.data.owner && auction.data.owner.name}
						/>
						<Anchor
							className={classes.link}
							href={`/marketplace/firm/${auction.data.ownerId}`}
						>
							{auction.data.owner && auction.data.owner.name}
						</Anchor>
					</Group>
					<Id className={classes.id} value={auction.data.id} variant="industry" />
				</Group>
			</Stack>
		</Group>
	);
};
