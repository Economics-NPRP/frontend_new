'use client';

// import { useTranslations } from 'next-intl';
import { useTranslations, useFormatter } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Switch } from '@/components/SwitchCase';
import { generateBidsRows, generateLegend } from '@/components/Tables/Bids/helpers';
import { withProviders } from '@/helpers';
import { BidsFilter } from '@/components/Tables/Bids/types';
import {
  IAllWinningBidsContext,
  IMyOpenAuctionResultsContext,
  IMyPaginatedBidsContext,
  IPaginatedBidsContext,
  IPaginatedWinningBidsContext,
  MyUserProfileContext,
} from '@/contexts';
import { SelectionSummaryContext, SelectionSummaryProvider } from '@/components/Tables/_components/SelectionSummary';
import { useKeysetPaginationText } from '@/hooks';
import { IBidData } from '@/schema/models';
import { KeysetPaginatedData } from '@/types';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Menu,
  Pill,
  Radio,
  Select,
  Stack,
  Table,
  TableProps,
  Text,
  Title,
  Tooltip,
  Flex,
  TextInput,
  Input
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useListState } from '@mantine/hooks';
import { CurrencyBadge } from '@/components/Badge';
import { DateTime } from 'luxon';
import {
  IconAdjustments,
  IconArrowNarrowDown,
  IconChevronLeft,
  IconChevronRight,
  IconDatabaseOff,
  IconDownload,
  IconError404,
  IconX,
  IconReportAnalytics,
  IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface NewBidsTableProps extends TableProps {
  bids: IPaginatedBidsContext;
  allWinningBids?: IAllWinningBidsContext;
  paginatedWinningBids?: IPaginatedWinningBidsContext;
  myPaginatedBids?: IMyPaginatedBidsContext;
  myOpenAuctionResults?: IMyOpenAuctionResultsContext;

  showContributingBids?: boolean;

  loading?: boolean;
  unavailable?: boolean;

  withCloseButton?: boolean;
  onClose?: () => void;

  hideHeader?: boolean;

  withViewAllButton?: boolean;
  onViewAll?: () => void;

  tableClassName?: string;

  bidsRecords?: IBidData[];
}
const _NewBidsTable = ({
  bids,
  allWinningBids,
  paginatedWinningBids,
  myPaginatedBids,
  myOpenAuctionResults,

  showContributingBids,

  loading = false,
  unavailable = false,

  withCloseButton,
  onClose,

  hideHeader,

  withViewAllButton,
  onViewAll,

  className,
  tableClassName,

  bidsRecords,

  ...props
}: NewBidsTableProps) => {
  const t = useTranslations();
  const format = useFormatter();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const myUser = useContext(MyUserProfileContext);

  const [bidsFilter, setBidsFilter] = useState<BidsFilter>('all');

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedResults, setSelected] = useListState([]);
  const { open } = useContext(SelectionSummaryContext);

  //	Generate the table rows
  const tableData = useMemo(() => {
    if (!bids) return null;
    return generateBidsRows({
      bids,
      allWinningBids,
      paginatedWinningBids,
      myPaginatedBids,
      myOpenAuctionResults,
      bidsFilter,
      myUser,
    });
  }, [
    bids,
    allWinningBids,
    paginatedWinningBids,
    myPaginatedBids,
    myOpenAuctionResults,
    bidsFilter,
    myUser,
  ]);

  const dataTableColumns = useMemo(
    () => [
      {
        accessor: 'company',
        title: t('components.bidsTable.columns.company'),
        width: 200,
        render: (record: any) => <span className="font-semibold">{record.bidder.name}</span>,
      },
      {
        accessor: 'bid',
        title: t('components.bidsTable.columns.bid'),
        textAlign: 'left' as const,
        render: (record: any) => (
          <span className="flex items-center justify-start gap-1">
            <CurrencyBadge /> {format.number(record.amount, 'money')}
          </span>
        ),
      },
      {
        accessor: 'permits',
        title: t('constants.permits.key'),
        textAlign: 'left' as const,
        render: (record: any) => format.number(record.permits),
      },
      {
        accessor: 'total',
        title: t('components.bidsTable.columns.totalBid'),
        textAlign: 'left' as const,
        render: (record: any) => (
          <span className="flex items-center justify-start gap-1">
            <CurrencyBadge /> {format.number(record.amount * record.permits, 'money')}
          </span>
        ),
      },
      {
        accessor: 'timestamp',
        title: t('components.bidsTable.columns.timestamp'),
        width: 160,
        render: (record: any) => DateTime.fromISO(record.timestamp).toRelative(),
      },
    ],
    [t, format],
  );

  //	Generate the filter badges
  const filterBadges = useMemo(() => {
    if (!bids) return null;
    if (bidsFilter === 'all')
      return (
        <Pill className={classes.badge}>
          {t('components.bidsTable.filters.badges.all')}
        </Pill>
      );
    if (bidsFilter === 'winning')
      return (
        <Pill
          className={classes.badge}
          onRemove={() => setBidsFilter('all')}
          withRemoveButton
        >
          {t('components.bidsTable.filters.badges.winning')}
        </Pill>
      );
    if (bidsFilter === 'mine')
      return (
        <Pill
          className={classes.badge}
          onRemove={() => setBidsFilter('all')}
          withRemoveButton
        >
          {t('components.bidsTable.filters.badges.mine')}
        </Pill>
      );
    if (bidsFilter === 'contributing')
      return (
        <Pill
          className={classes.badge}
          onRemove={() => setBidsFilter('all')}
          withRemoveButton
        >
          {t('components.bidsTable.filters.badges.contributing')}
        </Pill>
      );
  }, [bids, bidsFilter]);

  //	Generate the legend based on the bids filter
  const legend = useMemo(() => {
    if (!bids) return null;
    return generateLegend(t, bidsFilter, showContributingBids);
  }, [bids, t, bidsFilter, showContributingBids]);

  const currentContextState = useMemo(() => {
    if (bidsFilter === 'winning' && paginatedWinningBids) return paginatedWinningBids;
    if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids;
    return bids;
  }, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter]);

  const paginationText = useKeysetPaginationText('bids', {
    perPage: currentContextState.perPage,
    //	@ts-expect-error - we are making a custom context state here so its missing some properties
    data: {
      isExact:
        bidsFilter === 'winning' && paginatedWinningBids
          ? true
          : (currentContextState.data as KeysetPaginatedData<IBidData>).isExact,
      totalCount: currentContextState.data.totalCount,
    },
  });

  const handleSetPerPage = useCallback(
    (value: string | null) => {
      bids.setPerPage(Number(value));
      if (paginatedWinningBids) paginatedWinningBids.setPerPage(Number(value));
      if (myPaginatedBids) myPaginatedBids.setPerPage(Number(value));
    },
    [bids, paginatedWinningBids, myPaginatedBids],
  );

  const hasPrev = useMemo(() => {
    if (bidsFilter === 'winning' && paginatedWinningBids)
      return paginatedWinningBids.data.page > 1;
    if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasPrev;
    return bids.data.hasPrev;
  }, [
    bidsFilter,
    bids.data.hasPrev,
    paginatedWinningBids?.data.page,
    myPaginatedBids?.data.hasPrev,
  ]);

  const hasNext = useMemo(() => {
    if (bidsFilter === 'winning' && paginatedWinningBids)
      return paginatedWinningBids.data.page < paginatedWinningBids.data.pageCount;
    if (bidsFilter === 'mine' && myPaginatedBids) return myPaginatedBids.data.hasNext;
    return bids.data.hasNext;
  }, [
    bidsFilter,
    bids.data.hasNext,
    paginatedWinningBids?.data.page,
    paginatedWinningBids?.data.pageCount,
    myPaginatedBids?.data.hasNext,
  ]);

  const handlePrevPage = useCallback(() => {
    if (!hasPrev) return;
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    if (bidsFilter === 'winning' && paginatedWinningBids)
      paginatedWinningBids.setPage(paginatedWinningBids.data.page - 1);
    else if (bidsFilter === 'mine' && myPaginatedBids)
      myPaginatedBids.setCursor(myPaginatedBids.data.cursorForPrevPage);
    else bids.setCursor(bids.data.cursorForPrevPage);
  }, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter, hasPrev]);

  const handleNextPage = useCallback(() => {
    if (!hasNext) return;
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    if (bidsFilter === 'winning' && paginatedWinningBids)
      paginatedWinningBids.setPage(paginatedWinningBids.data.page + 1);
    else if (bidsFilter === 'mine' && myPaginatedBids)
      myPaginatedBids.setCursor(myPaginatedBids.data.cursorForNextPage);
    else bids.setCursor(bids.data.cursorForNextPage);
  }, [bids, paginatedWinningBids, myPaginatedBids, bidsFilter, hasNext]);

  //	Reset the page when the bids filter or per page changes
  useEffect(() => {
    bids.setCursor(null);
    if (paginatedWinningBids) paginatedWinningBids.setPage(1);
    if (myPaginatedBids) myPaginatedBids.setCursor(null);
  }, [bidsFilter, bids.perPage, paginatedWinningBids?.perPage, myPaginatedBids?.perPage]);

  const currentState = useMemo(() => {
    if (!tableData && loading) return 'loading';
    if (unavailable) return 'unavailable';
    if (!tableData || tableData.length === 0) return 'empty';
    return 'ok';
  }, [loading, tableData]);

  // NEW - start
  const generateSummaryGroups = useCallback((selected: any) => [
    {
      title: t('components.auctionsTable.summary.distribution.title'),
      rows: [
        {
          label: t('components.auctionsTable.summary.distribution.total'),
          value: t('constants.quantities.auctions.default', {
            value: selected.length,
          }),
        }
      ],
    },
  ], [selectedResults]);

  // const dataTableRowClassName = (record: any) => {
  //   if (!record || record.length === 0) return 'bg-gray-50 dark:bg-dark-500';
  //   const isMine = record.bidder.id === myUser?.data.id;
  //   const isWinning = winningBidIds.includes(record.id);
  //   const isContributing = contributingBidIds.includes(record.id);
  //   const arr: string[] = [];
  //   if (isMine) arr.push('bg-gray-50 dark:bg-dark-500');
  //   if (isWinning) arr.push('outline outline-1 outline-green-500');
  //   if (isContributing) arr.push('outline outline-1 outline-amber-500');
  //   return arr.join(' ');
  // };
  // NEW - END

  return (
    <Stack className={`${classes.root} ${className}`}>
      {!hideHeader && (
        <Stack className={classes.header}>
          <Group className={classes.row}>
            <Group className={classes.label}>
              <Title order={2} className={classes.title}>
                {t('components.bidsTable.title')}
              </Title>
              <Text className={classes.subtitle}>{paginationText}</Text>
            </Group>
            <Group className={classes.settings}>
              <Text className={classes.label}>
                {t('constants.pagination.perPage.label')}
              </Text>
              <Select
                className={classes.dropdown}
                w={80}
                value={currentContextState.perPage.toString()}
                data={['10', '20', '50', '100']}
                onChange={handleSetPerPage}
                allowDeselect={false}
              />
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon className={classes.button}>
                    <IconAdjustments size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown className={classes.filterMenu}>
                  <Radio.Group
                    classNames={{ label: classes.label }}
                    label={t('components.bidsTable.filters.menu.title')}
                    value={bidsFilter}
                    onChange={(value) => setBidsFilter(value as BidsFilter)}
                  >
                    <Stack className={classes.options}>
                      <Radio
                        value="all"
                        label={t(
                          'components.bidsTable.filters.menu.options.all',
                        )}
                      />
                      {showContributingBids && (
                        <Radio
                          value="contributing"
                          label={t(
                            'components.bidsTable.filters.menu.options.contributing',
                          )}
                        />
                      )}
                      {paginatedWinningBids && (
                        <Radio
                          value="winning"
                          label={t(
                            'components.bidsTable.filters.menu.options.winning',
                          )}
                        />
                      )}
                      <Radio
                        value="mine"
                        label={t(
                          'components.bidsTable.filters.menu.options.mine',
                        )}
                      />
                    </Stack>
                  </Radio.Group>
                </Menu.Dropdown>
              </Menu>
              <Tooltip label={t('constants.download.bids')}>
                <ActionIcon className={classes.button}>
                  <IconDownload size={16} />
                </ActionIcon>
              </Tooltip>
              {withCloseButton && (
                <ActionIcon className={classes.button} onClick={onClose}>
                  <IconX size={16} />
                </ActionIcon>
              )}
            </Group>
          </Group>
          <Group className={`${classes.row} ${classes.wrapMobile}`}>
            <Group className={classes.filters}>
              <Text className={classes.label}>
                {t('components.bidsTable.filters.label')}
              </Text>
              <Group className={classes.group}>{filterBadges}</Group>
            </Group>
            <Group className={classes.legend}>{legend}</Group>
          </Group>
        </Stack>
      )}
      <Flex>
        <Flex align="center" justify="space-between" className="w-full">
          <TextInput
            className="inline-block w-72"
            placeholder={t('components.bidsTable.search.placeholder')}
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchFilter !== '' ? (
                <Input.ClearButton onClick={() => setSearchFilter('')} />
              ) : undefined
            }
            rightSectionPointerEvents="auto"
          />
          <Flex align="center" className="gap-4 mb-4">
            <Pill
              classNames={{
                root: classes.count,
                label: classes.label,
                remove: classes.remove,
              }}
              variant="subtle"
              // onRemove={() => selectedAuctionsHandlers.setState([])}
              // withRemoveButton={selectedAuctions.length > 0}
            >
              {t('components.table.selected.count', {
                value: selectedResults.length,
              })}
            </Pill>
            <Button
              className={`${classes.secondary} ${classes.button}`}
              variant="outline"
              disabled={selectedResults.length === 0}
              rightSection={<IconReportAnalytics size={16} />}
              onClick={() =>
                open(
                  selectedResults,
                  generateSummaryGroups,
                )
              }
            >
              {t('components.table.selected.viewSummary')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <DataTable
        className={classes.table}
        withColumnBorders
        records={bidsRecords}
        columns={dataTableColumns as any}
        fetching={loading}
        idAccessor="id"
        selectedRecords={selectedResults}
        onSelectedRecordsChange={setSelected.setState as React.Dispatch<React.SetStateAction<IBidData[]>>} // Don't focus on the type too much it's just to get rid of type errors
        noRecordsText={t('components.bidsTable.empty')}
      // rowClassName={dataTableRowClassName}
      />
      {/* Changing page */}
      <Group className={classes.footer}>
        {bids.isSuccess && (
          <Group className={classes.pagination}>
            <ActionIcon
              className={classes.button}
              variant="outline"
              disabled={!hasPrev}
              onClick={handlePrevPage}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
            <ActionIcon
              className={classes.button}
              variant="outline"
              disabled={!hasNext}
              onClick={handleNextPage}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
        )}
        {hideHeader &&
          (withViewAllButton ? (
            <Group className={classes.row}>
              <Group className={classes.legend}>{legend}</Group>
              <Divider orientation="vertical" />
              <Button
                className={classes.button}
                variant="outline"
                onClick={onViewAll}
              >
                {t('constants.view.allBids.label')}
              </Button>
            </Group>
          ) : (
            <Group className={classes.legend}>{legend}</Group>
          ))}
      </Group>
    </Stack>
  );
};

export const NewBidsTable: React.JSXElementConstructor<NewBidsTableProps> = (props: NewBidsTableProps) =>
  withProviders(<_NewBidsTable {...props} />, { provider: SelectionSummaryProvider });