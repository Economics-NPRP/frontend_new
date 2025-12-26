import { DataTable } from "mantine-datatable"
import { Stack, Text, Divider } from "@mantine/core"

import { useTranslations } from "next-intl"

import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero"

import { IconHammer } from "@tabler/icons-react"

const SMAuctions = () => {

  const t = useTranslations()

  return (
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
        ]}
      />
      <Divider my="4" />
      
    </Stack>
  )
}

export default SMAuctions