'use client'
import { Stack } from "@mantine/core"
import { MyAuctionsTable } from "../_components/MyAuctionsTable"
import { useMemo } from "react"

const SMAuctionList = () => {
  // TODO: Replace with actual PaginatedAuctionsContext
  const emptyAuctionsContext = useMemo(() => ({
    data: { results: [], total: 0 },
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    perPage: 10,
    setPerPage: () => { },
    page: 1,
    setPage: () => { },
    filters: {
      status: 'all' as const,
      type: 'all' as const,
      sector: [],
      joined: 'all' as const,
      ownership: 'all' as const,
    },
    setSingleFilter: () => { },
    setAllFilters: () => { },
    removeFilter: () => { },
    resetFilters: () => { },
  }), [])

  return (
    <Stack>
      <MyAuctionsTable auctions={emptyAuctionsContext as any} />
    </Stack>
  )
}

export default SMAuctionList