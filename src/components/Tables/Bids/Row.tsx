import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ComponentProps } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import { Anchor, Group, Table, Tooltip } from '@mantine/core';
import { IconHexagonLetterC, IconHexagonLetterW, IconUserHexagon } from '@tabler/icons-react';

import classes from '../styles.module.css';

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
	const t = useTranslations();
	const format = useFormatter();

	return (
		<Table.Tr className={`${isMine ? classes.gray : ''}`} {...props}>
			<Table.Td className={`${classes.firm} ${classes.between}`}>
				<Anchor
					component={Link}
					className={classes.anchor}
					href={`/marketplace/company/${bid.bidder.id}`}
				>
					{bid.bidder.name}
				</Anchor>
				<Group className={classes.group}>
					{isMine && (
						<Tooltip
							label={t('components.bidsTable.legend.mine.tooltip')}
							position="top"
						>
							<IconUserHexagon size={14} className={classes.mine} />
						</Tooltip>
					)}
					{isContributing && (
						<Tooltip
							label={t('components.bidsTable.legend.contributing.tooltip')}
							position="top"
						>
							<IconHexagonLetterC size={14} className={classes.contributing} />
						</Tooltip>
					)}
					{isWinning && (
						<Tooltip
							label={t('components.bidsTable.legend.winning.tooltip')}
							position="top"
						>
							<IconHexagonLetterW size={14} className={classes.winning} />
						</Tooltip>
					)}
				</Group>
			</Table.Td>
			<Table.Td className={classes.bid}>
				<CurrencyBadge className="mr-1" />
				{format.number(bid.amount, 'money')}
			</Table.Td>
			<Table.Td className={classes.permit}>{format.number(bid.permits)}</Table.Td>
			<Table.Td className={classes.total}>
				<CurrencyBadge className="mr-1" />
				{format.number(bid.amount * bid.permits, 'money')}
			</Table.Td>
			<Table.Td className={classes.timestamp}>
				{DateTime.fromISO(bid.timestamp).toRelative()}
			</Table.Td>
		</Table.Tr>
	);
};
