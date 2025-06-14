import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { ComponentProps } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import { Anchor, Group, Table, Tooltip } from '@mantine/core';
import { IconHexagonLetterC, IconHexagonLetterW, IconUserHexagon } from '@tabler/icons-react';

import classes from './styles.module.css';

interface BidsTableRowProps extends ComponentProps<'tr'> {
	bid: IBidData;
	isMine: boolean;
	isWinning: boolean;
	isContributing: boolean;
}
export const BidsTableRow = ({
	bid,
	isMine,
	isWinning,
	isContributing,
	...props
}: BidsTableRowProps) => {
	const format = useFormatter();

	return (
		<Table.Tr className={`${isMine ? classes.mine : ''}`} {...props}>
			<Table.Td className={classes.firm}>
				<Anchor className={classes.anchor} href={`/marketplace/company/${bid.bidder.id}`}>
					{bid.bidder.name}
				</Anchor>
				<Group className={classes.badges}>
					{isMine && (
						<Tooltip label="This is your bid" position="top">
							<IconUserHexagon size={14} className={classes.mine} />
						</Tooltip>
					)}
					{isContributing && (
						<Tooltip label="This bid is contributing to your final bill" position="top">
							<IconHexagonLetterC size={14} className={classes.contributing} />
						</Tooltip>
					)}
					{isWinning && (
						<Tooltip label="This is a winning bid" position="top">
							<IconHexagonLetterW size={14} className={classes.winning} />
						</Tooltip>
					)}
				</Group>
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
