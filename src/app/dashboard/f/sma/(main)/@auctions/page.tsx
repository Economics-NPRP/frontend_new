'use client'
import { Stack, Container, Text, Title } from "@mantine/core"
import { PaginatedAuctionsContext } from "contexts"
import { EndedAuctionsList } from "@/pages/dashboard/a/permits/(main)/@list/_components/EndedAuctionsList"
import { useContext, useEffect } from "react"

const EndedAuctions = () => {

  const auctions = useContext(PaginatedAuctionsContext)

  useEffect(() => {
    console.log("firm auctions", auctions)
  }, [auctions])

  return (
    <Stack>
      <Container>
        <Title className="heading-1" order={1}>Ended Auctions</Title>
        <Text className="paragraph-md">Here you can find all ended auctions.</Text>
      </Container>
      <EndedAuctionsList isFirmAuctions={true} />
    </Stack>
  )
}

export default EndedAuctions