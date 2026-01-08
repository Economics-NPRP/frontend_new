'use client'
import Request from "./_components/Request"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Stack, Flex, Text, Group, Pill, Select, ActionIcon, Popover, ScrollArea, Button, NumberInput, TextInput } from "@mantine/core"
import { PaginatedSMApprovalsContext } from "contexts/PaginatedSMApprovalsAdmin"
import { IconAdjustments, IconX, IconDots } from "@tabler/icons-react"
import { useOffsetPaginationText } from "@/hooks"
import { TablePagination } from "@/components/Tables/_components/Pagination"

import classes from "./styles.module.css"
import { PermitTransferStatusListFilter } from "@/schema/models/PermitTransferStatus"

const TransfersList = () => {

  const requests = useContext(PaginatedSMApprovalsContext)
  const listContainer = useRef(null)
  const paginationText = useOffsetPaginationText('results', requests)

  const [starting, setStarting] = useState(true)

  useEffect(() => {
    if (requests?.isLoading) {
      setStarting(false)
    }
  }, [requests?.isLoading])

  // Generate the filter badges
  const filterBadges = useMemo(() => {
    if (!requests) return null

    const output = []
    const { status, emissionId, toFirmId, fromFirmId, createdFrom, createdTo } = requests.filters

    if (status && status !== 'all') {
      output.push(
        <Pill
          key={'status'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('status', 'all')}
          withRemoveButton
        >
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </Pill>,
      )
    }

    if (emissionId) {
      output.push(
        <Pill
          key={'emissionId'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('emissionId', 0)}
          withRemoveButton
        >
          Emission ID: {emissionId}
        </Pill>,
      )
    }

    if (fromFirmId) {
      output.push(
        <Pill
          key={'fromFirmId'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('fromFirmId', '')}
          withRemoveButton
        >
          From Firm: {fromFirmId}
        </Pill>,
      )
    }

    if (toFirmId) {
      output.push(
        <Pill
          key={'toFirmId'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('toFirmId', '')}
          withRemoveButton
        >
          To Firm: {toFirmId}
        </Pill>,
      )
    }

    if (createdFrom) {
      output.push(
        <Pill
          key={'createdFrom'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('createdFrom', '')}
          withRemoveButton
        >
          From: {createdFrom.replace('T', ' ')}
        </Pill>,
      )
    }

    if (createdTo) {
      output.push(
        <Pill
          key={'createdTo'}
          className={classes.badge}
          onRemove={() => requests.setSingleFilter('createdTo', '')}
          withRemoveButton
        >
          To: {createdTo.replace('T', ' ')}
        </Pill>,
      )
    }

    if (output.length === 0)
      return (
        <Pill className={classes.badge}>
          All Requests
        </Pill>
      )
    return output
  }, [requests, requests?.filters])

  return (
    <Stack className={classes.list}>
      <Stack className={classes.header}>
        <Flex justify={"space-between"} className={`${classes.row} ${classes.wrapMobile}`}>
          <Group className={classes.label}>
            <Text className="paragraph-sm">
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
              value={requests.perPage.toString()}
              data={['10', '20', '50', '100']}
              onChange={(value) => requests.setPerPage(Number(value))}
              allowDeselect={false}
            />

            <Popover width={320} position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon className={classes.button}>
                  <IconAdjustments size={16} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <ScrollArea.Autosize h={400} type="scroll">
                  <Stack gap="sm">
                    <Select
                      label="Status"
                      data={PermitTransferStatusListFilter}
                      value={requests.filters.status || 'all'}
                      onChange={(val) => requests.setSingleFilter('status', val || 'all')}
                    />
                    <NumberInput
                      label="Emission ID"
                      value={requests.filters.emissionId || ''}
                      onChange={(val) => requests.setSingleFilter('emissionId', val)}
                      min={0}
                    />
                    <TextInput
                      label="From Firm ID"
                      value={requests.filters.fromFirmId || ''}
                      onChange={(e) => requests.setSingleFilter('fromFirmId', e.currentTarget.value)}
                    />
                    <TextInput
                      label="To Firm ID"
                      value={requests.filters.toFirmId || ''}
                      onChange={(e) => requests.setSingleFilter('toFirmId', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Created From"
                      type="datetime-local"
                      value={requests.filters.createdFrom || ''}
                      onChange={(e) => requests.setSingleFilter('createdFrom', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Created To"
                      type="datetime-local"
                      value={requests.filters.createdTo || ''}
                      onChange={(e) => requests.setSingleFilter('createdTo', e.currentTarget.value)}
                    />

                    <Button variant="light" color="red" onClick={requests.resetFilters}>
                      Clear all filters
                    </Button>
                  </Stack>
                </ScrollArea.Autosize>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Flex>
        <Group className={`${classes.row} ${classes.wrapMobile}`}>
          <Text className={classes.subtitle}>
            {paginationText}
          </Text>
        </Group>
      </Stack>

      <Stack ref={listContainer} gap={16} className={classes.list}>
        {requests && requests.data && requests.data.results && requests.data.results.length > 0 && !requests.isLoading ? (
          requests.data.results.map((request) => (
            <Request key={`request-${request.id}`} request={request} />
          ))
        ) : (requests.isLoading || starting) ? (
          <Text className={classes.placeholder}>
            <IconDots className={classes.icon} size={32} />
            <Text className={classes.text} span>Loading transfers...</Text>
          </Text>
        ) : (
          <Text className={classes.placeholder}>
            <IconX className={classes.icon} size={32} />
            <Text className={classes.text} span>No transfers found</Text>
          </Text>
        )}
      </Stack>
      <Group className={classes.footer}>
        {requests.isSuccess && (
          <TablePagination context={requests} tableContainerRef={listContainer} />
        )}
      </Group>
    </Stack>
  )
}

export default TransfersList