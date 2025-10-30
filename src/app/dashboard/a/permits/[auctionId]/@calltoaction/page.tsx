'use client'
import { Grid, Stack, Text, Container, Group } from "@mantine/core"
import { BarChart } from "@mantine/charts"
import { useTranslations } from "next-intl"
import { ActionBanner } from "@/components/ActionBanner"
import classes from "./styles.module.css"
import Link from "next/dist/client/link"
import { IconFileSearch, IconCircleFilled } from "@tabler/icons-react"
import { Divider } from "@mantine/core"

const CallToAction = () => {
  const t = useTranslations()
  const demoData = [
    { label: 'Accepted', value: 143, color: '#51cf66' },
    { label: 'Pending', value: 245, color: '#ffd43b' },
    { label: 'Rejected', value: 90, color: '#ff6b6b' },
    { label: 'Locked', value: 53, color: '#adb5bd' },
    { label: 'Expired', value: 4, color: '#cc5de8' },
  ]

  return (
    <>
      <Grid className={classes.root} columns={4} gutter={12}>
        <Grid.Col span={2}>
          <Stack className={classes.chart}>
            <Text fw={600} className={classes.title}>{t('dashboard.admin.permits.callToAction.title')}</Text>
            <BarChart
              h={200}
              data={demoData}
              textColor="#ffffff90"
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
                          {data.payload.label}: {data.value}
                        </Text>
                      </Group>
                    </Container>
                  );
                },
              }}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col className={classes.audits} span={2}>
          <ActionBanner
            className={classes.banner}
            icon={<IconFileSearch size={32} />}
            heading={t('dashboard.admin.permits.callToAction.auditCompany.heading')}
            subheading={t('dashboard.admin.permits.callToAction.auditCompany.subheading')}
            component={Link}
            href="/firms"
            index={1}
          />
          <ActionBanner
            className={classes.banner}
            icon={<IconFileSearch size={32} />}
            heading={t('dashboard.admin.permits.callToAction.auditCompany.heading')}
            subheading={t('dashboard.admin.permits.callToAction.auditCompany.subheading')}
            component={Link}
            href="/firms"
            index={2}
          />
        </Grid.Col>
      </Grid>
      <Divider className={classes.divider} />
    </>
  )
}

export default CallToAction