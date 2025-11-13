'use client'
import { Stack } from "@mantine/core"
import { MyAuctionsTable } from "../_components/MyAuctionsTable"
import { useContext, useMemo } from "react"
import { PaginatedAuctionsContext } from "contexts/PaginatedAuctions"

const SMAuctionList = () => {
  const auctions = useContext(PaginatedAuctionsContext)
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
      <MyAuctionsTable auctions={auctions} />
    </Stack>
  )
}

export default SMAuctionList