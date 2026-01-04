'use client'
import { Stack, Flex, Text, Group, Pill, Select, Menu, ActionIcon, TextInput, Radio } from "@mantine/core"
import { IconAdjustments, IconSearch } from "@tabler/icons-react"
import { generateDescription } from "@/lib/auctions"
import { useContext, useMemo, useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { EndedAuction } from "./EndedAuction"
import { IPaginatedAuctionsContext, PaginatedAuctionsContext } from "contexts/PaginatedAuctions"
import { useOffsetPaginationText } from "@/hooks"
import { TablePagination } from "@/components/Tables/_components/Pagination"

import { IconX, IconDots } from "@tabler/icons-react"

import classes from "./styles.module.css"

const EndedAuctionsList = ({ isFirmAuctions=false }:{ isFirmAuctions?: boolean }) => {

  const auctions = useContext<IPaginatedAuctionsContext>(PaginatedAuctionsContext)

  const t = useTranslations()
  const listContainer = useRef(null)
  const paginationText = useOffsetPaginationText('auctions', auctions)

  const [searchFilter, setSearchFilter] = useState('')

  //	Generate the filter badges
  const filterBadges = useMemo(() => {
    if (!auctions) return null

    const output = []

    const type = auctions.filters.type

    switch (type) {
      case 'all':
        output.push(
          <Pill
            key={'all'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('type', 'all')}
            withRemoveButton
          >
            All
          </Pill>,
        )
        break
      case 'open':
        output.push(
          <Pill
            key={'open'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('type', 'all')}
            withRemoveButton
          >
            Open
          </Pill>,
        )
        break
      case 'sealed':
        output.push(
          <Pill
            key={'sealed'}
            className={classes.badge}
            onRemove={() => auctions.setSingleFilter('type', 'all')}
            withRemoveButton
          >
            Sealed
          </Pill>,
        )
        break
    }

    if (output.length === 0)
      return (
        <Pill className={classes.badge}>
          All Auctions
        </Pill>
      )
    return output
  }, [auctions, auctions?.filters?.type, auctions?.filters?.status, t])

  return (
    <Stack className={classes.list}>
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
              Per page {/* TODO: Change to translated */}
            </Text>
            <Select
              className={classes.dropdown}
              w={80}
              value={auctions.perPage.toString()}
              data={['10', '20', '50', '100']}
              onChange={(value) => auctions.setPerPage(Number(value))}
              allowDeselect={false}
            />
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon className={classes.button}>
                  <IconAdjustments size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className={"px-4 pt-2 pb-4"}>
                <Menu.Label className={"p-0 mb-3"}>
                  Auction Type
                </Menu.Label>
                <Radio.Group
                  value={auctions?.filters?.type}
                  onChange={(value) => auctions.setSingleFilter('type', value)}
                >
                  <Stack className={classes.options}>
                    <Radio value="all" label="All" />
                    <Radio value="open" label="Open" />
                    <Radio value="sealed" label="Sealed" />
                  </Stack>
                </Radio.Group>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
        <Flex justify={"space-between"} className={`${classes.row} ${classes.wrapMobile}`}>
          <TextInput
            className={classes.search}
            placeholder="Search by auction name..."
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
          /> {/* TODO: Implement searching */}
        </Flex>
        <Group className={`${classes.row} ${classes.wrapMobile}`}>
          <Text className={classes.subtitle}>
            {paginationText}
          </Text>
        </Group>
      </Stack>
      <Stack ref={listContainer} gap={16} className={classes.list}>
        {auctions && auctions.data && auctions.data.results && auctions.data.results.length > 0 && !auctions.isLoading ? (
          auctions.data.results.map((auction) => (
            <EndedAuction
              isFirmAuction={isFirmAuctions}
              key={auction.id}
              id={auction.id}
              name={auction.title}
              description={auction.description || generateDescription(auction.title, auction.sector)}
              winningBids={auction.biddersCount}
              cycle={auction.cycle?.title || ''}
              permits={auction.permits || 0}
              endDate={auction.endDatetime}
              pieChartData={{
                accepted: Math.floor(Math.random() * 20),
                rejected: Math.floor(Math.random() * 20),
                pending: Math.floor(Math.random() * 20),
              }}
            />
          ))
        ) : (auctions.isLoading) ? (
          <Text className={classes.placeholder}>
            <IconDots className={classes.icon} size={32} />
            <Text className={classes.text} span>{t("dashboard.permits.endedAuctions.loading")}</Text>
          </Text>
        ) : (
          <Text className={classes.placeholder}>
            <IconX className={classes.icon} size={32} />
            <Text className={classes.text} span>{t("dashboard.permits.endedAuctions.empty")}</Text>
          </Text>
        )}
      </Stack>
      <Group className={classes.footer}>
        {auctions.isSuccess && (
          <TablePagination context={auctions} tableContainerRef={listContainer} />
        )}
      </Group>
    </Stack>
  )
}

export { EndedAuctionsList }