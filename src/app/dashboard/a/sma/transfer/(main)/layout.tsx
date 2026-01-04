import { withProviders } from "@/helpers";
import { ListSecondaryMarketApprovalsProvider } from "@/contexts";
import { ReactNode } from "react";
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero";
import { IconHammer } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Metadata } from 'next';
import { ReviewTransferModalProvider } from "@/pages/dashboard/a/sma/transfer/(main)/@list/_components/ReviewTransferModal";

export const metadata: Metadata = {
  title: {
    default: 'Transfer Requests',
    template: '%s | Transfer Requests',
  },
};
export default function TransferRequestsLayout({ list }: { list: ReactNode }) {

  const t = useTranslations()

  return withProviders(
    <>
      <DashboardHero
        icon={<IconHammer size={24} />}
        title={t('constants.pages.dashboard.admin.sma.transfer.title')}
        description={t('constants.pages.dashboard.admin.sma.transfer.description')}
        returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.admin.home.title'),
            href: '/dashboard/a',
          },
          {
            label: t('constants.pages.dashboard.admin.sma.transfer.title'),
            href: '/dashboard/a/sma/transfer',
          },
        ]}
      />
      {list}
    </>,
    { provider: ListSecondaryMarketApprovalsProvider },
    { provider: ReviewTransferModalProvider }
  );
}
