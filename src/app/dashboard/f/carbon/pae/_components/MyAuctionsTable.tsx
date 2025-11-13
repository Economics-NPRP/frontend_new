'use client';
import { Stack, Group, Text, Pill, Select, TextInput, Anchor, Input } from "@mantine/core";
import { useMemo, useRef, useState, useContext } from "react";
import { IconSearch } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { DateTime } from "luxon";
import Link from "next/link";
import { useTranslations, useFormatter } from "next-intl";
import { useOffsetPaginationText } from "@/hooks";
import { IPaginatedAuctionsContext, PaginatedAuctionsContext, PaginatedAuctionsProvider, MyUserProfileContext } from "@/contexts";
import { TablePagination } from "@/components/Tables/_components/Pagination";
import { AuctionTypeBadge, AuctionStatusBadge, SectorBadge, CurrencyBadge } from "@/components/Badge";
import classes from "./styles.module.css";
import { withProviders } from "helpers/withProviders";

export interface MyAuctionsTableProps {
  auctions: IPaginatedAuctionsContext;
  className?: string;
}

const _MyAuctionsTable = ({ auctions, className }: MyAuctionsTableProps) => {
  const t = useTranslations();
  const format = useFormatter();
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const paginationText = useOffsetPaginationText('auctions', auctions);

  const [searchFilter, setSearchFilter] = useState('');

  //	Generate the filter badges
  const filterBadges = useMemo(() => {
    if (!auctions) return null;
    const output = [];

    switch (auctions.filters.status) {
      case 'upcoming':
        output.push(
          <Pill
            key={'upcoming'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('status', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.upcoming')}
          </Pill>,
        );
        break;
      case 'ongoing':
        output.push(
          <Pill
            key={'ongoing'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('status', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.ongoing')}
          </Pill>,
        );
        break;
      case 'ended':
        output.push(
          <Pill
            key={'ended'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('status', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.ended')}
          </Pill>,
        );
        break;
    }

    switch (auctions.filters.type) {
      case 'open':
        output.push(
          <Pill
            key={'open'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('type', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.open')}
          </Pill>,
        );
        break;
      case 'sealed':
        output.push(
          <Pill
            key={'sealed'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('type', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.sealed')}
          </Pill>,
        );
        break;
    }

    if (output.length === 0)
      return (
        <Pill className={classes.badge}>
          {t('components.auctionsTable.filters.badges.all')}
        </Pill>
      );
    return output;
  }, [auctions, auctions?.filters.status, auctions?.filters.type, t]);

  return (
    <Stack className={`${classes.root} ${className}`}>
      <Stack gap={8} className={classes.header}>
        <Group className={classes.label}>
          <Text className={classes.title}>
            {t('dashboard.firm.carbon.pae.myAuctions.title')}
          </Text>
        </Group>
        <Group className={classes.label}>
          <Text className={classes.subtitle}>
            {t('dashboard.firm.carbon.pae.myAuctions.description')}
          </Text>
        </Group>
        <Group justify="space-between" align="center" className={`${classes.row} ${classes.wrapMobile}`}>
          <Group align="center" className={classes.filters}>
            <Text className={classes.label}>
              {t('components.auctionsTable.filters.label')}
            </Text>
            <Group className={classes.group}>{filterBadges}</Group>
          </Group>
          <Group className={classes.settings}>
            <Text className={classes.label}>
              {t('constants.pagination.perPage.label')}
            </Text>
            <Select
              className={classes.dropdown}
              w={80}
              value={auctions.perPage.toString()}
              data={['10', '20', '50', '100']}
              onChange={(value) => auctions.setPerPage(Number(value))}
              allowDeselect={false}
            />
          </Group>
        </Group>
        <Group justify="space-between" className={`${classes.row} ${classes.wrapMobile}`}>
          <TextInput
            className={classes.search}
            placeholder={t('components.auctionsTable.search.placeholder')}
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
          <Group className={classes.subtitle}>
            <Text className={classes.subtitle}>
              {paginationText}
            </Text>
          </Group>
        </Group>
      </Stack>
      {/* Expect - data table props from library are not exposed */}
      <DataTable
        className={classes.table}
        columns={[
          {
            accessor: 'title',
            sortable: true,
            title: t('components.auctionsTable.columns.name'),
            width: 240,
            ellipsis: true,
            render: (record) => (
              <Anchor
                component={Link}
                className={classes.anchor}
                href={`/marketplace/auction/${record.id}`}
              >
                {record.title}
              </Anchor>
            ),
          },
          {
            accessor: 'type',
            sortable: true,
            title: t('components.auctionsTable.columns.type'),
            width: 120,
            cellsClassName: classes.status,
            render: (record) => (
              <AuctionTypeBadge type={record.type} showOpen />
            ),
          },
          {
            accessor: 'sector',
            sortable: true,
            title: t('components.auctionsTable.columns.sector'),
            width: 160,
            cellsClassName: classes.status,
            render: (record) => <SectorBadge sector={record.sector} />,
          },
          {
            accessor: 'status',
            sortable: true,
            title: t('components.auctionsTable.columns.status'),
            width: 120,
            cellsClassName: classes.status,
            render: (record) => <AuctionStatusBadge auctionData={record} />,
          },
          {
            accessor: 'permits',
            sortable: true,
            title: t('components.auctionsTable.columns.permits'),
            width: 140,
            render: (record) =>
              t('constants.quantities.permits.default', {
                value: record.permits,
              }),
          },
          {
            accessor: 'minBid',
            sortable: true,
            title: t('components.auctionsTable.columns.minBid'),
            width: 160,
            cellsClassName: classes.cell,
            render: (record) => (
              <>
                <CurrencyBadge className="mr-1" />
                {format.number(record.minBid, 'money')}
              </>
            ),
          },
          {
            accessor: 'bids',
            sortable: true,
            title: t('components.auctionsTable.columns.bids'),
            width: 100,
            render: (record) =>
              t('constants.quantities.bids.default', {
                value: record.bidsCount || 0,
              }),
          },
          {
            accessor: 'startDatetime',
            sortable: true,
            title: t('components.auctionsTable.columns.startDatetime'),
            width: 160,
            render: (record) =>
              DateTime.fromISO(record.startDatetime).toLocaleString(
                DateTime.DATETIME_MED,
              ),
          },
          {
            accessor: 'endDatetime',
            sortable: true,
            title: t('components.auctionsTable.columns.endDatetime'),
            width: 160,
            render: (record) =>
              DateTime.fromISO(record.endDatetime).toLocaleString(
                DateTime.DATETIME_MED,
              ),
          },
        ]}
        records={auctions.data?.results || []}
        striped
        withRowBorders
        withColumnBorders
        highlightOnHover
        fetching={auctions.isLoading}
        idAccessor="id"
        noRecordsText={t('components.auctionsTable.empty')}
        scrollViewportRef={tableContainerRef}
      />
      <Group justify="center" mt={4} className={classes.footer}>
        {auctions.isSuccess && (
          <TablePagination context={auctions} tableContainerRef={tableContainerRef} />
        )}
      </Group>
    </Stack>
  );
};
const MyAuctionsTable = (props: MyAuctionsTableProps) => {
  const firm = useContext(MyUserProfileContext);
  return withProviders(<_MyAuctionsTable {...props} />, {
    provider: PaginatedAuctionsProvider,
    props: {
      defaultFilters: {
        ownerId: firm?.id || '',
        ownership: 'private'
      }
    }
  });
}
export { MyAuctionsTable };
