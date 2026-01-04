'use client'
import { Stack, Title, Text } from "@mantine/core"
import { useTranslations } from "next-intl"
import classes from "./styles.module.css"
import { WinnersTable } from "./_components/WinnersTable"

const Winners = () => {
  const t = useTranslations()

  return (
    <Stack gap={4} className={classes.root}>
      <Title className={classes.title} order={1}>{t("dashboard.admin.permits.winners.title")}</Title>
      <Text className={classes.description}>{t("dashboard.admin.permits.winners.subtitle")}</Text>
      <WinnersTable />
    </Stack>
  )
}

export default Winners