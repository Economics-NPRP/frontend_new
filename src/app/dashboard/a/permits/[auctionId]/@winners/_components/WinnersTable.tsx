import { Stack, Flex, Text, Group, Pill, Select, Menu, ActionIcon, Container, TextInput, Button, Checkbox, Anchor } from "@mantine/core";
import { useMediaQuery, useListState } from "@mantine/hooks";
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { IconAdjustments, IconReportAnalytics, IconFilterSearch, IconSearch } from "@tabler/icons-react";
import { IPaginatedWinningBidsContext } from "contexts/PaginatedWinningBids"
import { SelectionSummaryContext } from "@/components/Tables/_components/SelectionSummary";
import classes from "./styles.module.css"
import { useTranslations, useFormatter } from "next-intl";
import { useOffsetPaginationText } from "@/hooks";
import { IBidData, PermitsFilterType } from "@/schema/models";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/navigation";

type WinnersTableProps = {
  bids: IPaginatedWinningBidsContext;
}
const bid = {
  "id": 0,
  "auctionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bidderId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "timestamp": "2025-11-01T10:40:48.364Z",
  "amount": 25200000,
  "permits": 96,
  "bidder": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "BigBidder",
    "phone": "12345678",
    "email": "user@example.com",
    "otherEmails": [
      "user@example.com"
    ],
    "sectors": [
      "energy"
    ],
    "emailVerified": true,
    "phoneVerified": true,
    "isActive": true,
    "createdAt": "2025-11-01T10:40:48.364Z",
    "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
const demoData = [
  ...Array(10).fill(bid)
]
const WinnersTable = ({ bids }: WinnersTableProps) => {

  const router = useRouter()
  const t = useTranslations();
  const format = useFormatter();
  const isMobile = useMediaQuery('(max-width: 48em)');
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const paginationText = useOffsetPaginationText('winningBids', bids);
  const { open } = useContext(SelectionSummaryContext);

  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedBids, selectedBidsHandlers] = useListState<IBidData>([]);

  //	Generate the filter badges
  const filterBadges = useMemo(() => {
    if (!bids) return null;

    if (showSelectedOnly)
      return (
        <Pill
          className={classes.badge}
          onRemove={() => setShowSelectedOnly(false)}
          withRemoveButton
        >
          {t('components.table.selected.filterSelectedBadge')}
        </Pill>
      );

    // Get the active filter types (everything except 'all')
    const activeFilters = (bids.filters.type || []).filter(type => type !== 'all');

    if (activeFilters.length === 0) {
      return (
        <Pill className={classes.badge}>
          All Permits
        </Pill>
      );
    }

    // Create a pill for each active filter
    return activeFilters.map((filterType) => (
      <Pill
        key={filterType}
        className={classes.badge}
        onRemove={() => {
          // Remove this specific filter from the array
          const newFilters = activeFilters.filter(f => f !== filterType);
          bids.setAllFilters({
            type: newFilters.length > 0 ? newFilters as PermitsFilterType[] : ['all']
          });
        }}
        withRemoveButton
      >
        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </Pill>
    ));
  }, [bids, bids?.filters.type, showSelectedOnly, t]);

  const generateSummaryGroups = useCallback((selected: Array<IBidData>) => [
    {
      title: 'Distribution',
      rows: [
        {
          label: 'Total Bids',
          value: selected.length,
        },
        {
          label: 'Total Permits',
          value: selected.reduce((acc, bid) => acc + bid.permits, 0),
        },
        {
          label: 'Total Amount',
          value: format.number(selected.reduce((acc, bid) => acc + bid.amount, 0), 'money'),
        },
      ],
    },
    {
      title: 'Permits',
      rows: [
        {
          label: 'Min Permits',
          value: Math.min(...selected.map((bid) => bid.permits)),
        },
        {
          label: 'Avg Permits',
          value: Math.round(selected.reduce((acc, bid) => acc + bid.permits, 0) / selected.length),
        },
        {
          label: 'Max Permits',
          value: Math.max(...selected.map((bid) => bid.permits)),
        },
      ],
    },
    {
      title: 'Bid Amount',
      rows: [
        {
          label: 'Min Amount',
          value: format.number(Math.min(...selected.map((bid) => bid.amount)), 'money'),
        },
        {
          label: 'Avg Amount',
          value: format.number(selected.reduce((acc, bid) => acc + bid.amount, 0) / selected.length, 'money'),
        },
        {
          label: 'Max Amount',
          value: format.number(Math.max(...selected.map((bid) => bid.amount)), 'money'),
        },
      ],
    },
  ], [format]);

  //	If we are showing selected only and there are no selected bids, disable the filter
  useEffect(() => {
    if (showSelectedOnly && selectedBids.length === 0) setShowSelectedOnly(false);
  }, [showSelectedOnly, selectedBids.length]);


  return (
    <Stack className={classes.winnersTable}>
      <Stack className={classes.header}>
        <Flex justify={"space-between"} className={`${classes.row} ${classes.wrapMobile}`}>
          <Group className={classes.label}>
            <Text className={classes.label}>
              Filters
            </Text>
            <Group className={classes.group}>{filterBadges}</Group>
          </Group>
          <Group className={classes.settings}>
            <Text className={classes.label}>
              Per page
            </Text>
            <Select
              className={classes.dropdown}
              w={80}
              value={bids.perPage.toString()}
              data={['10', '20', '50', '100']}
              onChange={(value) => bids.setPerPage(Number(value))}
              allowDeselect={false}
              disabled={showSelectedOnly}
            />
            <Menu position="bottom-end" disabled={showSelectedOnly}>
              <Menu.Target>
                <ActionIcon className={classes.button} disabled={showSelectedOnly}>
                  <IconAdjustments size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className={classes.filterMenu}>
                <Menu.Label className={classes.label}>
                  Permit Status
                </Menu.Label>
                <Checkbox.Group
                  value={bids.filters.type}
                  onChange={(value) => {
                    bids.setAllFilters({ type: value as PermitsFilterType[] });
                  }}
                >
                  <Stack className={classes.options}>
                    <Checkbox value="all" label="All" />
                    <Checkbox value="pending" label="Pending" />
                    <Checkbox value="approved" label="Approved" />
                    <Checkbox value="rejected" label="Rejected" />
                    <Checkbox value="locked" label="Locked" />
                    <Checkbox value="unlocked" label="Unlocked" />
                    <Checkbox value="expired" label="Expired" />
                    <Checkbox value="valid" label="Valid" />
                  </Stack>
                </Checkbox.Group>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
        <Flex justify={"space-between"} className={`${classes.row} ${classes.wrapMobile}`}>
          <TextInput
            className={classes.search}
            placeholder="Search by bidder name or email..."
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            disabled={showSelectedOnly}
          />
          <Group className={classes.actions}>
            <Pill
              classNames={{
                root: classes.count,
                label: classes.label,
                remove: classes.remove,
              }}
              variant="subtle"
              onRemove={() => selectedBidsHandlers.setState([])}
              withRemoveButton={selectedBids.length > 0}
            >
              {selectedBids.length} selected
            </Pill>
            <Group className={classes.buttons}>
              <Button
                className={`${classes.secondary} ${classes.button}`}
                variant="outline"
                disabled={selectedBids.length === 0}
                rightSection={<IconReportAnalytics size={16} />}
                onClick={() =>
                  open(
                    selectedBids,
                    generateSummaryGroups as () => Array<any>,
                  )
                }
              >
                View Summary
              </Button>
              <Button
                className={`${classes.secondary} ${classes.button}`}
                variant="outline"
                disabled={selectedBids.length === 0}
                rightSection={<IconFilterSearch size={16} />}
                onClick={() => setShowSelectedOnly((prev) => !prev)}
              >
                {showSelectedOnly ? 'Reset Filter' : 'Filter Selected'}
              </Button>
            </Group>
          </Group>
        </Flex>
        <Group className={`${classes.row} ${classes.wrapMobile}`}>
          <Text className={classes.subtitle}>
            {showSelectedOnly
              ? `${selectedBids.length} selected`
              : paginationText}
          </Text>
        </Group>
      </Stack>
      {/* Table would go here */}
      <Container className={classes.table}>
        {
          
        }
      </Container>
    </Stack>
  )
}

export { WinnersTable }