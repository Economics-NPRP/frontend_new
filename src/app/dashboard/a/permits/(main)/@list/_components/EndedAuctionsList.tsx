import { Stack } from "@mantine/core"
import { EndedAuction } from "./EndedAuction"
import { EndedAuctionProps } from "./EndedAuction"
const EndedAuctionsList = () => {

  const testData: EndedAuctionProps = {
    id: "676767",
    name: "big auctions",
    description: "this is a description of a big auction",
    winningBids: 5,
    cycle: "Future Cycle - Extended",
    owner: "The Big Man",
    endDate: "October 7th, 2025",
    pieChartData: {
      accepted: 10,
      rejected: 5,
      pending: 2,
    }
  }

  return (
    <Stack>
      <EndedAuction
        {...testData}
      />
      <EndedAuction
        {...testData}
        winningBids={12}
        name="Another Auction"
        description="this is another description of a big auction"
        pieChartData={{
          accepted: 3,
          rejected: 5,
          pending: 25,
        }}
      />
    </Stack>
  )
}

export { EndedAuctionsList }