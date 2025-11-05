import { Stack } from "@mantine/core"
import { withProviders } from "helpers/withProviders"
import { SingleAuctionProvider } from "contexts/SingleAuction"
import { PaginatedWinningBidsProvider } from "contexts/PaginatedWinningBids"
import { MyUserProfileProvider } from "contexts/MyUserProfile"
import { AuctionPermitsHero } from "@/pages/dashboard/a/permits/[auctionId]/_components/AuctionPermitsHero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Auction Permits',
};

type AuctionPermitsProps = {
  winners: React.ReactNode;
  calltoaction: React.ReactNode;
}
const AuctionPermits = ({ winners, calltoaction }: AuctionPermitsProps) => {

  return withProviders(
    <Stack>
      <AuctionPermitsHero />
      {calltoaction}
      {winners}
    </Stack>,
    { provider: MyUserProfileProvider },
    { provider: SingleAuctionProvider },
    { provider: PaginatedWinningBidsProvider }
  )
}

export default AuctionPermits