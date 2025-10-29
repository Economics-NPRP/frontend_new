import { Group, Stack } from "@mantine/core"
import { StatCard } from "@/components/StatCard"
import { IconDotsCircleHorizontal, IconLock, IconCalendarX } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import classes from "./styles.module.css"
import { PermitDistribution } from "./_components/PermitDistribution"
import { Divider } from "@mantine/core"

const PermitSubbanners = () => {

  const t = useTranslations()
  const { stats, loading } = {
    stats: "something",
    loading: {
      totalPermits: false,
    }
  }

  return (
    <Stack className={classes.root}>
      <Group className={classes.row}>
        <StatCard
          large={true}
          className={classes.statCard}
          icon={<IconDotsCircleHorizontal size={120} />}
          title={t('dashboard.admin.permits.stats.pending.title')}
          tooltip={t('dashboard.admin.permits.stats.pending.tooltip')}
          type="integer"
          unit={t('constants.permits.key')}
          value={43}
          comparison="none"
          subtitle={t('dashboard.admin.permits.stats.pending.subtitle')}
          loading={loading.totalPermits}
        />
        <StatCard
          large={true}
          className={classes.statCard}
          icon={<IconLock size={120} />}
          title={t('dashboard.admin.permits.stats.locked.title')}
          tooltip={t('dashboard.admin.permits.stats.locked.tooltip')}
          type="integer"
          unit={t('constants.permits.key')}
          value={43}
          comparison="none"
          subtitle={t('dashboard.admin.permits.stats.locked.subtitle')}
          loading={loading.totalPermits}
        />
        <StatCard
          large={true}
          className={classes.statCard}
          icon={<IconCalendarX size={120} />}
          title={t('dashboard.admin.permits.stats.expired.title')}
          tooltip={t('dashboard.admin.permits.stats.expired.tooltip')}
          type="integer"
          unit={t('constants.permits.key')}
          value={43}
          comparison="none"
          subtitle={t('dashboard.admin.permits.stats.expired.subtitle')}
          loading={loading.totalPermits}
        />
        <PermitDistribution
          data={[
            { status: 'Approved', value: 56, color: "#10b981" },
            { status: 'Pending', value: 80, color: "#fbbf24" },
            { status: 'Rejected', value: 15, color: "#f43f5e" },
          ]}
        />
      </Group>
      <Divider className={classes.divider} />
    </Stack>
  )
}

export default PermitSubbanners