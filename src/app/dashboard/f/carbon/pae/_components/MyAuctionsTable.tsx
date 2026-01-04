'use client';
import { Stack, Group, Text, Pill, Select, TextInput, Anchor, Input, Popover, Button, NumberInput, MultiSelect, ScrollArea } from "@mantine/core";
import { useMemo, useRef, useState } from "react";
import { IconSearch, IconFilter, IconAdjustments } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { DateTime } from "luxon";
import Link from "next/link";
import { useTranslations, useFormatter } from "next-intl";
import { useOffsetPaginationText } from "@/hooks";
import { IPaginatedFirmAuctionsContext } from "@/contexts";
import { TablePagination } from "@/components/Tables/_components/Pagination";
import { AuctionTypeBadge, AuctionStatusBadge, SectorBadge, CurrencyBadge } from "@/components/Badge";
import { SectorList } from "@/constants/SectorData";
import classes from "./styles.module.css";

export interface MyAuctionsTableProps {
  auctions: IPaginatedFirmAuctionsContext;
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

    switch (auctions.filters.auctionStatus) {
      case 'upcoming':
        output.push(
          <Pill
            key={'upcoming'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('auctionStatus', 'all')}
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
            onRemove={() => auctions.setSingleFilter('auctionStatus', 'all')}
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
            onRemove={() => auctions.setSingleFilter('auctionStatus', 'all')}
            withRemoveButton
          >
            {t('components.auctionsTable.filters.badges.ended')}
          </Pill>,
        );
        break;
    }

    switch (auctions.filters.auctionType) {
      case 'open':
        output.push(
          <Pill
            key={'open'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('auctionType', 'all')}
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
            onRemove={() => auctions.setSingleFilter('auctionType', 'all')}
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
  }, [auctions, auctions?.filters.auctionStatus, auctions?.filters.auctionType, t]);

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
            {/* Added Filter Dropdown */}
            <Popover width={320} position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <Button className="px-3">
                  <IconAdjustments size={16} />
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <ScrollArea.Autosize h={400} type="scroll">
                  <Stack gap="sm">
                    <Select
                      label={t('components.auctionCatalogue.filters.accordion.status.title')}
                      data={['all', 'upcoming', 'ongoing', 'ended']}
                      value={auctions.filters.auctionStatus || 'all'}
                      onChange={(val) => auctions.setSingleFilter('auctionStatus', val || 'all')}
                    />
                    <Select
                      label={t('components.auctionCatalogue.filters.accordion.type.title')}
                      data={['all', 'open', 'sealed']}
                      value={auctions.filters.auctionType || 'all'}
                      onChange={(val) => auctions.setSingleFilter('auctionType', val || 'all')}
                    />
                    <MultiSelect
                      label={t('components.auctionCatalogue.filters.accordion.sector.title')}
                      data={SectorList}
                      value={auctions.filters.sector || []}
                      onChange={(val) => auctions.setArrayFilter('sector', val)}
                      searchable
                    />
                    <Group grow>
                      <NumberInput
                        label={t('components.auctionCatalogue.filters.accordion.minPermits.title')}
                        value={auctions.filters.minPermits}
                        onChange={(val) => auctions.setSingleFilter('minPermits', val)}
                        min={0}
                      />
                      <NumberInput
                        label={t('components.auctionCatalogue.filters.accordion.maxPermits.title')}
                        value={auctions.filters.maxPermits}
                        onChange={(val) => auctions.setSingleFilter('maxPermits', val)}
                        min={0}
                      />
                    </Group>

                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.startDatetimeFrom.title')}
                      type="datetime-local"
                      value={auctions.filters.startDatetimeFrom || ''}
                      onChange={(e) => auctions.setSingleFilter('startDatetimeFrom', e.currentTarget.value)}
                    />
                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.startDatetimeTo.title')}
                      type="datetime-local"
                      value={auctions.filters.startDatetimeTo || ''}
                      onChange={(e) => auctions.setSingleFilter('startDatetimeTo', e.currentTarget.value)}
                    />
                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.endDatetimeFrom.title')}
                      type="datetime-local"
                      value={auctions.filters.endDatetimeFrom || ''}
                      onChange={(e) => auctions.setSingleFilter('endDatetimeFrom', e.currentTarget.value)}
                    />
                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.endDatetimeTo.title')}
                      type="datetime-local"
                      value={auctions.filters.endDatetimeTo || ''}
                      onChange={(e) => auctions.setSingleFilter('endDatetimeTo', e.currentTarget.value)}
                    />

                    <Select
                      label={t('components.auctionCatalogue.filters.accordion.isPrimaryMarket.label')}
                      data={[
                        { value: 'all', label: t('components.auctionCatalogue.filters.accordion.isPrimaryMarket.all.title') },
                        { value: 'true', label: t('components.auctionCatalogue.filters.accordion.isPrimaryMarket.primary.title') },
                        { value: 'false', label: t('components.auctionCatalogue.filters.accordion.isPrimaryMarket.secondary.title') }
                      ]}
                      value={auctions.filters.isPrimaryMarket === undefined ? 'all' : auctions.filters.isPrimaryMarket.toString()}
                      onChange={(val) => auctions.setSingleFilter('isPrimaryMarket', val === 'all' ? undefined : val === 'true')}
                    />

                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.auctionId.title')}
                      value={auctions.filters.auctionId || ''}
                      onChange={(e) => auctions.setSingleFilter('auctionId', e.currentTarget.value)}
                    />
                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.ownerId.title')}
                      value={auctions.filters.ownerId || ''}
                      onChange={(e) => auctions.setSingleFilter('ownerId', e.currentTarget.value)}
                    />
                    <TextInput
                      label={t('components.auctionCatalogue.filters.accordion.firmId.title')}
                      value={auctions.filters.firmId || ''}
                      onChange={(e) => auctions.setSingleFilter('firmId', e.currentTarget.value)}
                    />

                    <Button variant="light" color="red" onClick={auctions.resetFilters}>
                      {t('components.auctionCatalogue.filters.clear.tooltip')}
                    </Button>
                  </Stack>
                </ScrollArea.Autosize>
              </Popover.Dropdown>
            </Popover>
            {/* End Added Filter Dropdown */}
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
        minHeight={400}
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
  return <_MyAuctionsTable {...props} />
}
export { MyAuctionsTable };
