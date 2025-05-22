'use client';

import { DateTime } from 'luxon';
import Image from 'next/image';
import { useContext } from 'react';

import { AuctionTypeBadge, CategoryBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Anchor, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';

import { AuctionResultsContext } from '../constants';

export default function Details() {
	const { auctionData } = useContext(AuctionResultsContext);

	return (
		<Group>
			<Container className="relative size-40">
				<Image
					src={auctionData.image || '/imgs/industry/flare.jpg'}
					alt={'Image of a power plant'}
					fill
				/>
			</Container>
			<Stack>
				<Id value={auctionData.id} variant="industry" />
				<Title order={1}>Flare Gas Burning</Title>
				<Group>
					<CategoryBadge category={'industry'} />
					<AuctionTypeBadge type={auctionData.type} />
				</Group>
				<Group>
					<IconBox />
					<Anchor href={'/marketplace/firm/bfaaf345-dd15-4ce0-ad91-6f58d1fe7a64'}>
						{auctionData.owner && auctionData.owner.name}
					</Anchor>
				</Group>
			</Stack>

			<Stack>
				<Text>Ending In</Text>
				<LargeCountdown targetDate={auctionData.endDatetime} />
				<Text>
					{DateTime.fromISO(auctionData.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					)}
				</Text>
			</Stack>
		</Group>
	);
}
