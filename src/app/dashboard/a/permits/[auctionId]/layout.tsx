import { Stack } from "@mantine/core"
import { useTranslations } from "next-intl"
import { withProviders } from "helpers/withProviders"
import { SingleAuctionProvider } from "contexts/SingleAuction"
import { SingleAuctionContext } from "contexts/SingleAuction"
import { useContext, useEffect } from "react"
import { AuctionPermitsHero } from "@/pages/dashboard/a/permits/[auctionId]/_components/AuctionPermitsHero"
import { Metadata } from "next"

export const metadata:Metadata = {
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
    { provider: SingleAuctionProvider }
  )
}

export default AuctionPermits