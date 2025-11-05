import { Stack, Text } from '@mantine/core'
import { useTranslations } from 'next-intl'
import classes from './styles.module.css'
import { EndedAuctionsList } from './_components/EndedAuctionsList'

interface IPermitListAuction {
  id: string;
  name: string;
  description: string;
  winners: number;
}
const PermitList = () => {
  const t = useTranslations()
  return (
    <Stack className={classes.root}>
      <Stack gap={8} className={classes.text}>
        <Text className={classes.title}>{t('dashboard.admin.permits.list.title')}</Text>
        <Text className={classes.description}>{t('dashboard.admin.permits.list.description')}</Text>
      </Stack>
      <EndedAuctionsList />
    </Stack>
  )
}

export default PermitList