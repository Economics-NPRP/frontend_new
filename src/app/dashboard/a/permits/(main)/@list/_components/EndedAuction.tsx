'use client'
import { Group, Title, Text, Stack, Flex, Anchor, Box, Divider } from "@mantine/core"
import { PieChart } from "@mantine/charts"
import classes from "./styles.module.css"
import { Id } from "@/components/Id"
import { IconRefresh, IconCalendar, IconCheck, IconDots, IconX } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { DateTime } from "luxon"

export type EndedAuctionProps = {
  id: string;
  name: string;
  description: string;
  winningBids: number;
  cycle: string;
  endDate: string;
  pieChartData: {
    accepted: number;
    rejected: number;
    pending: number;
  }
}

const EndedAuction = (props: EndedAuctionProps) => {
  const t = useTranslations()

  return (
    <Anchor style={{ textDecoration: 'none' }} href={`/dashboard/a/permits/${props.id}`}>
      <Group className={classes.root}>
        <Flex flex={1} align={"center"} justify={"space-between"} className={classes.left}>
          <Stack gap={0} className={classes.text}>
            <Id
              value={props.id}
              variant="auction"
            />
            <Title order={2} className={classes.name}>{props.name.split(" - ")[0]}</Title>
            <Text className={classes.description}>{props.description}</Text>
            <Text className={classes.winners}>
              <Text span className={classes.winnerCount}>{props.winningBids}</Text>
              <Text span>{t("dashboard.permits.endedAuctions.winningBids")}</Text>
            </Text>
          </Stack>
          <Group className={classes.chart}>
            <Text fw={600} className={classes.chartText}>{t("dashboard.permits.endedAuctions.chart")}</Text>
            <PieChart
              data={[
                { name: 'Accepted', value: props.pieChartData.accepted, color: "#10b981" },
                { name: 'Rejected', value: props.pieChartData.rejected, color: "#f43f5e" },
                { name: 'Pending', value: props.pieChartData.pending, color: "#fbbf24" },
              ]}
              withTooltip
              tooltipAnimationDuration={200}
              tooltipProps={{
                animationDuration: 200,
                wrapperStyle: { transition: 'all 200ms ease' },
                content: ({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0];
                  const Icon = data.name === 'Accepted' ? IconCheck : data.name === 'Rejected' ? IconX : IconDots;

                  return (
                    <Box
                      className={classes.tooltip}
                    >
                      <Group gap={8} wrap="nowrap">
                        <Icon size={16} color={data.payload.fill} />
                        <Text span size="sm" c="gray.7">
                          {t("dashboard.permits.endedAuctions.tooltip.status", {
                            status: data.name                          })}
                        </Text>
                        <Text span size="sm" c="gray.7" fw={600}>
                          {t("dashboard.permits.endedAuctions.tooltip.value", {
                            value: data.value
                          })}
                        </Text>
                      </Group>
                    </Box>
                  );
                },
              }}
              size={100}
            />
          </Group>
        </Flex>
        <Flex flex={1} justify="center" align="center" className={classes.right}>
          <Stack flex={1.2} gap={0} align="center" className={classes.info}>
            <IconRefresh size={32} className={classes.icon} />
            <Title className={classes.infoTitle} order={5}>{t("dashboard.permits.endedAuctions.cycle")}</Title>
            <Text className={classes.infoText} fw={600}>{props.cycle}</Text>
          </Stack>
          <Divider orientation="vertical" my={32} className={classes.divider} />
          <Stack flex={1} gap={0} align="center" className={classes.info}>
            <IconCalendar size={32} className={classes.icon} />
            <Title className={classes.infoTitle} order={5}>{t("dashboard.permits.endedAuctions.endDate")}</Title>
            <Text className={classes.infoText} fw={600}>{DateTime.fromISO(
                          props.endDate,
                        ).toLocaleString(DateTime.DATETIME_MED).split(",").slice(0, 2).join(",")}</Text>
          </Stack>
        </Flex>
      </Group>
    </Anchor>
  )
}

export { EndedAuction }