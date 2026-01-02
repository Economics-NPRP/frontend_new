'use client'
import { Stack } from "@mantine/core"
import { MyAuctionsTable } from "../_components/MyAuctionsTable"
import { useContext, useEffect, useMemo } from "react"
import { PaginatedFirmAuctionsContext } from "contexts"

const SMAuctionList = () => {
  const auctions = useContext(PaginatedFirmAuctionsContext)

  useEffect(() => {
    console.log('Firm Auctions -> ',auctions)
  }, [auctions])
  
  return (
    <Stack>
      <MyAuctionsTable auctions={auctions} />
    </Stack>
  )
}

export default SMAuctionList