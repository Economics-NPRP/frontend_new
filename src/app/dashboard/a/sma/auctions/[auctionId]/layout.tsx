import { Stack } from "@mantine/core"
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero"
import { IconHammer, ReactNode } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Metadata } from 'next';
import { withProviders } from "helpers/withProviders";
import { SingleAuctionProvider } from "contexts/SingleAuction";

export const metadata: Metadata = {
  title: {
    default: 'Auction Details',
    template: '%s | Auction Details',
  },
};

const AuctionApplicationLayout = ({ auction }: { auction: ReactNode }) => {

  const t = useTranslations()

  return withProviders(
    <Stack>
      <DashboardHero
        icon={<IconHammer size={24} />}
        title={t('constants.pages.dashboard.admin.sma.auctions.title')}
        description={t('constants.pages.dashboard.admin.sma.auctions.description')}
        returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.admin.home.title'),
            href: '/dashboard/a',
          },
          {
            label: t('constants.pages.dashboard.admin.sma.auctions.title'),
            href: '/dashboard/a/sma/auctions',
          },
          {
            label: t('constants.pages.dashboard.admin.sma.auction.title'),
            href: '/dashboard/a/sma/auctions',
          }
        ]}
      />
      {auction}
    </Stack>,
    { provider: SingleAuctionProvider }
  )
}

export default AuctionApplicationLayout