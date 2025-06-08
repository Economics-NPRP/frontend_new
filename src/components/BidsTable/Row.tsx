import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { ComponentProps, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import { Anchor, MantineStyleProp, TableTd, TableTr } from '@mantine/core';

interface BidsTableRowProps extends ComponentProps<'tr'> {
	bid: IBidData;
	highlight: Array<string>;
}
export const BidsTableRow = ({ bid, highlight, ...props }: BidsTableRowProps) => {
	const format = useFormatter();

	const styles = useMemo<MantineStyleProp>(() => {
		if (highlight.length === 0) return {};

		const stripeSize = 100 / highlight.length;
		const stripes = highlight.map((type, index) => {
			const start = index * stripeSize;
			const end = start + stripeSize;
			let color;
			switch (type) {
				case 'contributing':
					color = '#e7f5ff';
					break;
				case 'winning':
					color = '#fff9db';
					break;
				case 'mine':
					color = '#f3f0ff';
					break;
				default:
					color = '#00000000';
					break;
			}
			return `${color} ${start}%, ${color} ${end}%`;
		});
		return {
			backgroundImage: `linear-gradient(to bottom, ${stripes.join(', ')})`,
		};
	}, [highlight]);

	return (
		<TableTr style={styles} {...props}>
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
