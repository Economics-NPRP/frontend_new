'use client'
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero"
import { IconGavel } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Grid } from "@mantine/core"
import { StatCard } from "@/components/StatCard"
import { IconHammer, IconCalendar, IconRepeat, IconFileSearch } from "@tabler/icons-react"

const Subbanners = () => {

  const t = useTranslations()

  return (
    <>
      <DashboardHero
        icon={<IconGavel size={24} />}
        title={t('constants.pages.dashboard.firms.sma.title')}
        description={t('constants.pages.dashboard.firms.sma.description')}
        returnButton={{ href: '/dashboard/f', label: t('constants.return.home.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.firms.home.title'),
            href: '/dashboard/f',
          },
          {
            label: t('constants.pages.dashboard.firms.sma.title'),
            href: '/dashboard/f/sma',
          },
        ]}
      />
      <Grid columns={12}>
        <Grid.Col span={3}>
          <StatCard
            large={true}
            title={t('dashboard.firm.sma.subbanners.sold.title')}
            tooltip={t('dashboard.firm.sma.subbanners.sold.tooltip')}
            value={42}
            className="h-full !py-4 !px-6"
            type="integer"
            unit={t('constants.permits.key')}
            icon={<IconHammer size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.sma.subbanners.sold.subtitle')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            large={true}
            title={t('dashboard.firm.sma.subbanners.ended.title')}
            tooltip={t('dashboard.firm.sma.subbanners.ended.tooltip')}
            value={42}
            className="h-full !py-4 !px-6"
            type="integer"
            unit={t('constants.auctions.key')}
            icon={<IconCalendar size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.sma.subbanners.ended.subtitle')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            large={true}
            title={t('dashboard.firm.sma.subbanners.ongoing.title')}
            tooltip={t('dashboard.firm.sma.subbanners.ongoing.tooltip')}
            value={32}
            className="h-full !py-4 !px-6"
            type="integer"
            unit={t('constants.auctions.key')}
            icon={<IconRepeat size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.sma.subbanners.ongoing.subtitle')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            large={true}
            title={t('dashboard.firm.sma.subbanners.pending.title')}
            tooltip={t('dashboard.firm.sma.subbanners.pending.tooltip')}
            value={32}
            className="h-full !py-4 !px-6"
            type="integer"
            unit={t('constants.permits.key')}
            icon={<IconFileSearch size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.sma.subbanners.pending.subtitle')}
          />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default Subbanners