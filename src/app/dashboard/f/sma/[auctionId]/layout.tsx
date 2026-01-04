import { Stack } from "@mantine/core"
import { withProviders } from "helpers/withProviders"
import { SingleAuctionProvider, PaginatedWinningBidsProvider, MyUserProfileProvider } from "contexts"
import { ReviewPermitsModalProvider } from "./@winners/_components/ReviewPermitsModal"
import { AuctionPermitsHero } from "./_components/AuctionPermitsHero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Permit Distribution',
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
    { provider: ReviewPermitsModalProvider },
    { provider: PaginatedWinningBidsProvider },
    { provider: SingleAuctionProvider },
    { provider: MyUserProfileProvider },
  )
}

export default AuctionPermits