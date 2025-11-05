'use client'
import { Grid, Stack, Container, Group, Text, Divider } from "@mantine/core"
import { BarChart } from "@mantine/charts"
import { DashboardHero } from "@/pages/dashboard/_components/DashboardHero"
import { useTranslations } from "next-intl"
import { IconFileDescription, IconFileCheck, IconLock, IconCalendarX, IconCircleFilled, IconGavel, IconReport } from "@tabler/icons-react"
import { StatCard } from "@/components/StatCard"
import Card from "@/components/Card/Card"
import Link from "next/link"
import { ActionBanner } from "@/components/ActionBanner"

import classes from "./styles.module.css"

const demoData = [
  { label: 'Pending', value: 245, color: '#ffd43b' },
  { label: 'Accepted', value: 143, color: '#51cf66' },
  { label: 'Rejected', value: 90, color: '#ff6b6b' }
]

const SubBanners = () => {

  const t = useTranslations();

  return (
    <Stack className={classes.root}>
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
      <Grid columns={13}>
        <Grid.Col span={4}>
          <Card
            title={t('dashboard.firm.carbon.pe.subbanners.distribution.title')}
            size="md"
            tooltip={t('dashboard.firm.carbon.pe.subbanners.distribution.tooltip')}
            className={"!py-4 !px-6"}
          >
            <BarChart
              h={110}
              data={demoData}
              textColor="gray.6"
              dataKey="label"
              orientation="vertical"
              series={[{ name: 'value', color: 'color' }]}
              tooltipAnimationDuration={50}
              tooltipProps={{
                animationDuration: 50,
                wrapperStyle: { transition: 'all 200ms ease' },
                content: ({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0];

                  return (
                    <Container className={classes.tooltip}>
                      <Group gap={8} wrap="nowrap">
                        <IconCircleFilled size={12} color={data.payload.color} />
                        <Text size="sm" c="gray.7" fw={500}>
                          {data.payload.label}: <Text span fw={600}>{data.value}</Text>
                        </Text>
                      </Group>
                    </Container>
                  );
                },
              }}
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title={t('dashboard.firm.carbon.pe.subbanners.approved.title')}
            tooltip={t('dashboard.firm.carbon.pe.subbanners.approved.tooltip')}
            value={42}
            className="h-full !py-4 !px-6"
            type="integer"
            large={true}
            unit={t('constants.permits.key')}
            icon={<IconFileCheck size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.carbon.pe.subbanners.approved.subtitle')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title={t('dashboard.firm.carbon.pe.subbanners.locked.title')}
            tooltip={t('dashboard.firm.carbon.pe.subbanners.locked.tooltip')}
            value={32}
            className="h-full !py-4 !px-6"
            type="integer"
            large={true}
            unit={t('constants.permits.key')}
            icon={<IconLock size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.carbon.pe.subbanners.locked.subtitle')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title={t('dashboard.firm.carbon.pe.subbanners.expired.title')}
            tooltip={t('dashboard.firm.carbon.pe.subbanners.expired.tooltip')}
            value={32}
            className="h-full !py-4 !px-6"
            type="integer"
            large={true}
            unit={t('constants.permits.key')}
            icon={<IconCalendarX size={120} />}
            comparison="none"
            subtitle={t('dashboard.firm.carbon.pe.subbanners.expired.subtitle')}
          />
        </Grid.Col>
      </Grid>
      <Grid columns={2}>
        <Grid.Col span={1}>
          <ActionBanner
            icon={<IconGavel size={32} />}
            heading={t('dashboard.firm.carbon.pe.subbanners.cta.sell.heading')}
            subheading={t('dashboard.firm.carbon.pe.subbanners.cta.sell.subheading')}
            component={Link}
            href="/create/auction"
            index={1}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <ActionBanner
            icon={<IconReport size={32} />}
            heading={t('dashboard.firm.carbon.pe.subbanners.cta.report.heading')}
            subheading={t('dashboard.firm.carbon.pe.subbanners.cta.report.subheading')}
            component={Link}
            href="/dashboard/f/carbon/pe/report"
            index={2}
          />
        </Grid.Col>
      </Grid>
      <Divider mt="4" color="gray.3" />
    </Stack>
  )
}

export default SubBanners