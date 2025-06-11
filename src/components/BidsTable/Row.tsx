import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { ComponentProps, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import { Anchor, MantineStyleProp, Table } from '@mantine/core';

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
		<Table.Tr style={styles} {...props}>
			<Table.Td>
				<Anchor href={`/marketplace/company/${bid.bidder.id}`}>{bid.bidder.name}</Anchor>
			</Table.Td>
			<Table.Td>
				<CurrencyBadge className="mr-1" />
				{format.number(bid.amount, 'money')}
			</Table.Td>
			<Table.Td>{format.number(bid.permits)}</Table.Td>
			<Table.Td>
				<CurrencyBadge className="mr-1" />
				{format.number(bid.amount * bid.permits, 'money')}
			</Table.Td>
			<Table.Td>{DateTime.fromISO(bid.timestamp).toRelative()}</Table.Td>
		</Table.Tr>
	);
};
