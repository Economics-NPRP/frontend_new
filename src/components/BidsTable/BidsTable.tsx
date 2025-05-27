'use client';

import { DateTime } from 'luxon';
import { createFormatter, useFormatter, useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { CurrentUserContext } from '@/pages/globalContext';
import { IBidData, IUserData } from '@/schema/models';
import { NavDirection } from '@/types';
import {
	ActionIcon,
	Anchor,
	CopyButton,
	Group,
	Pagination,
	Table,
	TableProps,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Tooltip,
} from '@mantine/core';
import {
	IconArrowNarrowDown,
	IconCheck,
	IconChevronLeft,
	IconChevronRight,
	IconCopy,
} from '@tabler/icons-react';

export interface BidsTableProps extends TableProps {
	tableData: Array<IBidData>;
	contributingBidIds?: Array<string>;
	winningBidIds?: Array<string>;
	paginationType: 'offset' | 'keyset';

	setCursor?: (cursor: string | null | undefined) => void;
	setNavDirection?: (direction: NavDirection) => void;
	hasNext?: boolean;
	hasPrev?: boolean;
	cursorForNextPage?: string | null;
	cursorForPrevPage?: string | null;

	page?: number;
	pageCount?: number;
	setPage?: (page: number) => void;
}
export const BidsTable = ({
	tableData,
	contributingBidIds,
	winningBidIds,
	paginationType,

	setCursor,
	setNavDirection,
	hasNext,
	hasPrev,
	cursorForNextPage,
	cursorForPrevPage,

	page,
	pageCount,
	setPage,
	...props
}: BidsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const { currentUser } = useContext(CurrentUserContext);

	const bidsData = useMemo(() => {
		if (!tableData) return null;
		return generateBidsRows(tableData, contributingBidIds, winningBidIds, currentUser, format);
	}, [tableData, contributingBidIds, winningBidIds, currentUser, format]);

	return (
		<>
			<Table highlightOnHover {...props}>
				<TableThead>
					<TableTr>
						<TableTh>Company</TableTh>
						<TableTh className="flex items-center justify-between">
							Bid
							<IconArrowNarrowDown size={14} />
						</TableTh>
						<TableTh>Permits</TableTh>
						<TableTh>Total Bid</TableTh>
						<TableTh>Timestamp</TableTh>
						<TableTh></TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>{bidsData}</TableTbody>
			</Table>
			{paginationType === 'offset' && page && pageCount && pageCount > 1 && setPage && (
				<Pagination
					value={page}
					total={pageCount}
					siblings={2}
					boundaries={3}
					onChange={setPage}
				/>
			)}
			{paginationType === 'keyset' && setCursor && setNavDirection && (
				<Group className="gap-2">
					<ActionIcon
						className="size-8 border-gray-300"
						variant="outline"
						disabled={!hasPrev}
						onClick={() => {
							setCursor(cursorForPrevPage);
							setNavDirection('prev');
						}}
					>
						<IconChevronLeft size={16} />
					</ActionIcon>
					<ActionIcon
						className="size-8 border-gray-300"
						variant="outline"
						disabled={!hasNext}
						onClick={() => {
							setCursor(cursorForNextPage);
							setNavDirection('next');
						}}
					>
						<IconChevronRight size={16} />
					</ActionIcon>
				</Group>
			)}
		</>
	);
};

const generateBidsRows = (
	bidsData: Array<IBidData>,
	contributingBidIds: Array<string> | undefined,
	winningBidIds: Array<string> | undefined,
	currentUser: IUserData,
	format: ReturnType<typeof createFormatter>,
) =>
	bidsData.map(({ id, amount, permits, timestamp, bidder }) => {
		let bgColor = '';
		if (contributingBidIds && contributingBidIds.includes(id)) bgColor = 'bg-blue-50';
		else if (winningBidIds && winningBidIds.includes(id)) bgColor = 'bg-yellow-50';
		else if (bidder.id === currentUser.id) bgColor = 'bg-gray-50';

		return (
			<TableTr key={id} className={bgColor}>
				<TableTd>
					<Anchor href={`/marketplace/company/${bidder.id}`}>{bidder.name}</Anchor>
				</TableTd>
				<TableTd>
					<CurrencyBadge />
					{format.number(amount, 'money')}
				</TableTd>
				<TableTd>{format.number(permits)}</TableTd>
				<TableTd>
					<CurrencyBadge />
					{format.number(amount * permits, 'money')}
				</TableTd>
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
		);
	});
