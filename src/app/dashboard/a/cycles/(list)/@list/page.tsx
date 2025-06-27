import { DateTime } from 'luxon';

import { AuctionCycleCard } from '@/components/AuctionCycleCard';

export default function CyclesListComponent() {
	return (
		<AuctionCycleCard
			auctionCycleData={{
				id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
				title: 'Summer 2025',
				status: 'draft',
				auctionsCount: 367,
				startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
				endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
				updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
			}}
		/>
	);
}
