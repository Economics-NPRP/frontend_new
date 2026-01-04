'use client'
import { useTranslations } from 'next-intl'
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero'
import { IconGavel } from '@tabler/icons-react'
import { useContext } from 'react'
import { SingleAuctionContext } from 'contexts'

const AuctionPermitsHero = () => {
  const t = useTranslations()
  const auction = useContext(SingleAuctionContext)

  return (
    <>
      <DashboardHero
        icon={<IconGavel size={24} />}
        title={t('constants.pages.dashboard.admin.permits.auctions.title')}
        description={t('constants.pages.dashboard.admin.permits.auctions.description', { value: auction.isLoading ? '...' : !auction.data ? '' : auction.data.title })}
        returnButton={{ href: '/dashboard/a/permits', label: t('constants.return.permits.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.admin.home.title'),
            href: '/dashboard/a',
          },
          {
            label: t('constants.pages.dashboard.admin.permits.title'),
            href: '/dashboard/a/permits',
          },
        ]}
      />
    </>
  )
}

export { AuctionPermitsHero }