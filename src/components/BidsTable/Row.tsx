import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { ComponentProps } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import { Anchor, TableTd, TableTr } from '@mantine/core';

export const BidsTableRow = ({ bid, ...props }: { bid: IBidData } & ComponentProps<'tr'>) => {
	const format = useFormatter();
	return (
		<TableTr {...props}>
			<TableTd>
				<Anchor href={`/marketplace/company/${bid.bidder.id}`}>{bid.bidder.name}</Anchor>
			</TableTd>
			<TableTd>
				<CurrencyBadge />
				{format.number(bid.amount, 'money')}
			</TableTd>
			<TableTd>{format.number(bid.permits)}</TableTd>
			<TableTd>
				<CurrencyBadge />
				{format.number(bid.amount * bid.permits, 'money')}
			</TableTd>
			<TableTd>{DateTime.fromISO(bid.timestamp).toRelative()}</TableTd>
		</TableTr>
	);
};
