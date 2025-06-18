'use client';

import { createFormatter, useFormatter, useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { IPaginatedOpenAuctionResultsContext, ISingleAuctionContext } from '@/contexts';
import { MyUserContext } from '@/contexts';
import { IAuctionData, IUserData } from '@/schema/models';
import { IAuctionResultsData } from '@/types';
import {
	Anchor,
	Container,
	Divider,
	Group,
	Loader,
	Pagination,
	Select,
	Stack,
	Table,
	TableProps,
	Text,
	Title,
	Tooltip,
	useMatches,
} from '@mantine/core';
import { IconArrowNarrowDown, IconDatabaseOff, IconUserHexagon } from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface ResultsTableProps extends TableProps {
	paginatedOpenAuctionResults: IPaginatedOpenAuctionResultsContext;
	auction: ISingleAuctionContext;
}
export const ResultsTable = ({
	paginatedOpenAuctionResults,
	auction,
	className,
	...props
}: ResultsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const isMobile = useMatches({ base: true, xs: false });
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const myUser = useContext(MyUserContext);

	const tableData = useMemo(() => {
		if (!paginatedOpenAuctionResults.data) return null;
		return generateResultsRows(
			t,
			paginatedOpenAuctionResults.data.results,
			auction.data,
			myUser.data,
			format,
		);
	}, [t, paginatedOpenAuctionResults.data.results, auction.data, myUser.data, format]);

	//	Reset page when perPage changes
	useEffect(() => paginatedOpenAuctionResults.setPage(1), [paginatedOpenAuctionResults.perPage]);

	const handleChangePage = useCallback(
		(newPage: number) => {
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
			paginatedOpenAuctionResults.setPage(newPage);
		},
		[paginatedOpenAuctionResults],
	);

	const currentState = useMemo(() => {
		if (!tableData && (paginatedOpenAuctionResults.isLoading || auction.isLoading))
			return 'loading';
		if (!paginatedOpenAuctionResults || paginatedOpenAuctionResults.data.results.length === 0)
			return 'empty';
		return 'ok';
	}, [paginatedOpenAuctionResults, auction]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.auctionResultsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{t('constants.pagination.offset.results', {
								start: Math.min(
									(paginatedOpenAuctionResults.page - 1) *
										paginatedOpenAuctionResults.perPage +
										1,
									paginatedOpenAuctionResults.data.totalCount,
								),
								end:
									(paginatedOpenAuctionResults.page - 1) *
										paginatedOpenAuctionResults.perPage +
										paginatedOpenAuctionResults.perPage >
									paginatedOpenAuctionResults.data.totalCount
										? paginatedOpenAuctionResults.data.totalCount
										: (paginatedOpenAuctionResults.page - 1) *
												paginatedOpenAuctionResults.perPage +
											paginatedOpenAuctionResults.perPage,
								total: paginatedOpenAuctionResults.data.totalCount,
							})}
						</Text>
					</Group>
					<Group className={classes.settings}>
						{!isMobile && (
							<>
								<Group className={classes.legend}>
									<Group className={classes.cell}>
										<IconUserHexagon
											size={16}
											className={`${classes.icon} ${classes.mine}`}
										/>
										<Text className={classes.value}>
											{t('components.auctionResultsTable.legend.mine.label')}
										</Text>
									</Group>
								</Group>
								<Divider orientation="vertical" className={classes.divider} />
							</>
						)}
						<Text className={classes.label}>
							{t('constants.pagination.perPage.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={paginatedOpenAuctionResults.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) =>
								paginatedOpenAuctionResults.setPerPage(Number(value))
							}
							allowDeselect={false}
						/>
					</Group>
				</Group>
			</Stack>
			<Container className={classes.table} ref={tableContainerRef}>
				<Table highlightOnHover withColumnBorders stickyHeader {...props}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className="min-w-[120px]">
								{t('components.auctionResultsTable.columns.company')}
							</Table.Th>
							<Table.Th className="min-w-[100px]">
								{t('components.auctionResultsTable.columns.totalBids')}
							</Table.Th>
							<Table.Th className="min-w-[160px]">
								{t('components.auctionResultsTable.columns.winningBids')}
							</Table.Th>
							<Table.Th className="min-w-[240px] flex items-center justify-between">
								{t('components.auctionResultsTable.columns.permits')}
								<IconArrowNarrowDown size={14} />
							</Table.Th>
							<Table.Th className="min-w-[160px]">
								{t('components.auctionResultsTable.columns.avgPrice')}
							</Table.Th>
							<Table.Th className="min-w-[160px]">
								{t('components.auctionResultsTable.columns.bill')}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{tableData}</Table.Tbody>
				</Table>
				<Switch value={currentState}>
					<Switch.Loading>
						<Stack className={classes.placeholder}>
							<Loader color="gray" />
						</Stack>
					</Switch.Loading>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>
								{t('components.auctionResultsTable.empty')}
							</Text>
						</Stack>
					</Switch.Case>
				</Switch>
			</Container>
			{paginatedOpenAuctionResults.isSuccess && (
				<Pagination
					className={classes.pagination}
					value={paginatedOpenAuctionResults.page}
					total={paginatedOpenAuctionResults.data.pageCount}
					siblings={2}
					boundaries={3}
					onChange={handleChangePage}
				/>
			)}
		</Stack>
	);
};

const generateResultsRows = (
	t: ReturnType<typeof useTranslations>,
	resultsData: Array<IAuctionResultsData>,
	auctionData: IAuctionData,
	currentUser: IUserData,
	format: ReturnType<typeof createFormatter>,
) =>
	resultsData.map(
		({
			firm,
			totalBidsCount,
			winningBidsCount,
			permitsReserved,
			averagePricePerPermit,
			finalBill,
		}) => (
			<Table.Tr
				key={`${firm.id}-${finalBill}`}
				className={`${firm.id === currentUser.id ? classes.mine : ''}`}
			>
				<Table.Td className={classes.firm}>
					<Anchor className={classes.anchor} href={`/marketplace/company/${firm.id}`}>
						{firm.name}
					</Anchor>
					<Group className={classes.badges}>
						{firm.id === currentUser.id && (
							<Tooltip
								// @ts-expect-error - cant get typing from locale file
								label={t('components.auctionResultsTable.legend.mine.tooltip')}
								position="top"
							>
								<IconUserHexagon size={14} className={classes.mine} />
							</Tooltip>
						)}
					</Group>
				</Table.Td>
				<Table.Td>{format.number(totalBidsCount)}</Table.Td>
				<Table.Td>
					{/* @ts-expect-error - cant get typing from locale file */}
					{t('components.auctionResultsTable.data.winningBids', {
						value: winningBidsCount,
						percent: (winningBidsCount / totalBidsCount) * 100,
					})}
				</Table.Td>
				<Table.Td>
					{/* @ts-expect-error - cant get typing from locale file */}
					{t('components.auctionResultsTable.data.permits', {
						value: permitsReserved,
						percent: (permitsReserved / auctionData.permits) * 100,
					})}
				</Table.Td>
				<Table.Td>
					<CurrencyBadge className="mr-1" />
					{format.number(averagePricePerPermit, 'money')}
				</Table.Td>
				<Table.Td>
					<CurrencyBadge className="mr-1" />
					{format.number(finalBill, 'money')}
				</Table.Td>
			</Table.Tr>
		),
	);
