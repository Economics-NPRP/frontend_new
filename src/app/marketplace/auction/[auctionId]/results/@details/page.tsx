'use client';

import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useContext, useMemo } from 'react';

import { AuctionTypeBadge, CategoryBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Anchor, Container, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';

import { AuctionResultsContext } from '../constants';

export default function Details() {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionResultsContext);

	const auctioned = useMemo(() => Math.random() * 100, [auctionData.permits]);
	const bought = useMemo(() => 100 - auctioned, [auctioned]);

	return (
		<>
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
			<Group>
				<Title order={3}>Permits Available</Title>
				{/* TODO: replace with actual auctioned and bought numbers from backend */}
				<Progress.Root size={32} className="flex-auto">
					<Tooltip
						label={`Auctioned Permits - ${format.number(Math.round((auctioned / 100) * auctionData.permits))}`}
					>
						<Progress.Section value={auctioned} className="bg-maroon-600">
							<Progress.Label>Auctioned</Progress.Label>
						</Progress.Section>
					</Tooltip>
					<Tooltip
						label={`Bought Permits - ${format.number(Math.round((bought / 100) * auctionData.permits))}`}
					>
						<Progress.Section value={bought} className="bg-palm-600">
							<Progress.Label>Bought</Progress.Label>
						</Progress.Section>
					</Tooltip>
				</Progress.Root>
			</Group>
		</>
	);
}
