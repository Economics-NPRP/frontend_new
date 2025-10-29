'use client'
import { Box, Stack, Text } from "@mantine/core"
import { BarChart } from "@mantine/charts"
import { useTranslations } from "next-intl"
import classes from "./styles.module.css"

type PermitDistributionProps = {
  data: { status: 'Pending' | 'Approved' | 'Rejected', value: number, color?: string; }[];
  className?: string;
}
const PermitDistribution = ({
  data
}: PermitDistributionProps) => {
  const t = useTranslations()
  return (
    <Stack className={classes.root} flex={1}>
      <Text className={classes.title}>{t('dashboard.admin.permits.stats.distribution.title')}</Text>
      <Box className={classes.distribution}>
        <BarChart
          h={100}
          data={data}
          dataKey="status"
          series={[{ name: 'value', color: '#4C6EF5' }]}
          withYAxis={false}
          yAxisProps={{ width: 0 }}
          tooltipAnimationDuration={200}
          tooltipProps={{
            animationDuration: 200,
            wrapperStyle: { transition: 'all 200ms ease' },
            content: ({ label, payload }) => {
              if (!payload || payload.length === 0) return null;
              const value = payload[0].value;
              return (
                <Text className={classes.tooltip} size="sm" c="gray.6">
                  {t('dashboard.admin.permits.stats.distribution.tooltip', {
                    value: value,
                    status: label,
                  })}
                </Text>
              );
            },
          }}
        />
      </Box>
    </Stack>
  )
}

export { PermitDistribution }