import { withProviders } from "@/helpers";
import { ListSecondaryMarketApprovalsProvider } from "@/contexts";
import { ReactNode } from "react";
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero";
import { IconHammer } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Secondary Auction Applications',
    template: '%s | Secondary Auction Applications',
  },
};
export default function Layout({ list }: { list: ReactNode }) {
  
  const t = useTranslations()
  
  return withProviders(
    <>
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
        ]}
      />
      {list}
    </>,
    { provider: ListSecondaryMarketApprovalsProvider }
  );
}
