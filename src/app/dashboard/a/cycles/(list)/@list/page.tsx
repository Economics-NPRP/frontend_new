import { DateTime } from 'luxon';

import { AuctionCycleCard } from '@/components/AuctionCycleCard';
import { Stack } from '@mantine/core';

export default function CyclesListComponent() {
	return (
		<Stack>
			<AuctionCycleCard
				auctionCycleData={{
					id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
					title: 'Summer 2025',
					status: 'draft',
					auctionsCount: 367,
					emissionsCount: 143559152,
					startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
					endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
					updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
				}}
			/>
			<AuctionCycleCard
				auctionCycleData={{
					id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
					title: 'Summer 2025',
					status: 'approved',
					auctionsCount: 367,
					emissionsCount: 143559152,
					startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
					endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
					updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
				}}
				loading
			/>
			<AuctionCycleCard
				auctionCycleData={{
					id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
					title: 'Summer 2025',
					status: 'ongoing',
					auctionsCount: 367,
					emissionsCount: 143559152,
					startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
					endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
					updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
				}}
			/>
			<AuctionCycleCard
				auctionCycleData={{
					id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
					title: 'Summer 2025',
					status: 'ended',
					auctionsCount: 367,
					emissionsCount: 143559152,
					startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
					endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
					updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
				}}
			/>
		</Stack>
	);
}
