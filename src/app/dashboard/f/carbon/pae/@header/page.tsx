import { Grid, Stack } from "@mantine/core"
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero"
import { useTranslations } from "next-intl"
import { IconFileDescription } from "@tabler/icons-react"
const Header = () => {

  const t = useTranslations();

  return (
    <Stack>
      <DashboardHero
        icon={<IconFileDescription size={24} />}
        title={t('constants.pages.dashboard.firms.pae.title')}
        description={t('constants.pages.dashboard.firms.pae.description')}
        returnButton={{ href: '/dashboard/f', label: t('constants.return.permits.label') }}
        breadcrumbs={[
          {
            label: t('constants.pages.dashboard.firms.home.title'),
            href: '/dashboard/f',
          },
          {
            label: t('constants.pages.dashboard.firms.pae.title'),
            href: '/dashboard/f/carbon/pae',
          },
        ]}
      />
      <Grid columns={12}>
        
      </Grid>
    </Stack>
  )
}

export default Header