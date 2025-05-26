'use client';

import { DateTime } from 'luxon';
import { createFormatter, useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { IBidData } from '@/schema/models';
import {
	ActionIcon,
	Anchor,
	CopyButton,
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
import { IconCheck, IconCopy } from '@tabler/icons-react';

export interface BidsTableProps extends TableProps {
	tableData: Array<IBidData>;
	paginationType: 'offset' | 'keyset';
	page?: number;
	pageCount?: number;
	setPage?: (page: number) => void;
}
export const BidsTable = ({
	tableData,
	paginationType,
	page,
	pageCount,
	setPage,
	...props
}: BidsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const bidsData = useMemo(() => {
		if (!tableData) return null;
		return generateBidsRows(tableData, format);
	}, [tableData]);

	return (
		<>
			<Table highlightOnHover {...props}>
				<TableThead>
					<TableTr>
						<TableTh>Company</TableTh>
						<TableTh>Bid</TableTh>
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
		</>
	);
};

const generateBidsRows = (bidsData: Array<IBidData>, format: ReturnType<typeof createFormatter>) =>
	bidsData.map(({ id, amount, permits, timestamp, bidder }) => (
		<TableTr key={id}>
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
	));
