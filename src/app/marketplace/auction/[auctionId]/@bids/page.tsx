'use client';

import { DateTime } from 'luxon';
import { createFormatter, useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import {
	ActionIcon,
	Anchor,
	CopyButton,
	Pagination,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';

const generateBidRows = (bids: Array<IBidData>, format: ReturnType<typeof createFormatter>) =>
	bids.map(({ id, amount, permits, timestamp, bidder }) => (
		<TableTr>
			<TableTd>
				<Anchor href={`/marketplace/company/${bidder.id}`}>{bidder.name}</Anchor>
			</TableTd>
			<TableTd>
				<CurrencyBadge />
				{format.number(amount, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</TableTd>
			<TableTd>{format.number(permits)}</TableTd>
			<TableTd>{DateTime.fromISO(timestamp).toRelative()}</TableTd>
			<TableTd>
				<CopyButton value={id} timeout={2000}>
					{({ copied, copy }) => (
						<Tooltip
							label={copied ? 'Copied' : 'Copy bid ID'}
							withArrow
							position="right"
						>
							<ActionIcon
								color={copied ? 'teal' : 'gray'}
								variant="subtle"
								onClick={copy}
							>
								{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
							</ActionIcon>
						</Tooltip>
					)}
				</CopyButton>
			</TableTd>
		</TableTr>
	));

export default function Bids() {
	const { winningPage, setWinningPage, minePage, setMinePage, winningBids, myBids } =
		useContext(AuctionDetailsContext);

	const format = useFormatter();

	const winningBidsData = useMemo(() => {
		if (!winningBids) return null;
		return generateBidRows(winningBids.results, format);
	}, [winningBids]);

	const myBidsData = useMemo(() => {
		if (!winningBids) return null;
		return generateBidRows(myBids.results, format);
	}, [myBids]);

	return (
		<Tabs defaultValue={'winning'}>
			<TabsList>
				<TabsTab value="winning">Current Winning Bids</TabsTab>
				<TabsTab value="mine">Your Submitted Bids</TabsTab>
			</TabsList>

			<TabsPanel value="winning">
				<Table highlightOnHover>
					<TableThead>
						<TableTr>
							<TableTh>Company</TableTh>
							<TableTh>Bid</TableTh>
							<TableTh>Permits</TableTh>
							<TableTh>Timestamp</TableTh>
							<TableTh></TableTh>
						</TableTr>
					</TableThead>
					<TableTbody>{winningBidsData}</TableTbody>
				</Table>
				<Pagination
					value={winningPage}
					total={winningBids.pageCount}
					siblings={2}
					boundaries={3}
					onChange={setWinningPage}
				/>
			</TabsPanel>

			<TabsPanel value="mine">
				<Table highlightOnHover>
					<TableThead>
						<TableTr>
							<TableTh>Company</TableTh>
							<TableTh>Bid</TableTh>
							<TableTh>Permits</TableTh>
							<TableTh>Timestamp</TableTh>
							<TableTh></TableTh>
						</TableTr>
					</TableThead>
					<TableTbody>{myBidsData}</TableTbody>
				</Table>
				<Pagination
					value={minePage}
					total={myBids.pageCount}
					siblings={2}
					boundaries={3}
					onChange={setMinePage}
				/>
			</TabsPanel>
		</Tabs>
	);
}
