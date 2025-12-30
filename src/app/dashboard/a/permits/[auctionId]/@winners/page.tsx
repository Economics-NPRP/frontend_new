'use client'
import { Stack, Title, Text } from "@mantine/core"
import { useTranslations } from "next-intl"
import classes from "./styles.module.css"
import { useContext, useEffect } from "react"
import { PaginatedWinningBidsContext } from "contexts/PaginatedWinningBids"
import { WinnersTable } from "./_components/WinnersTable"
import { ReviewPermitsModalProvider } from "./_components/ReviewPermitsModal"

const Winners = () => {
  const t = useTranslations()
  const winningBids = useContext(PaginatedWinningBidsContext)

  useEffect(() => {
    console.log("WinningBidsContext", winningBids)
  }, [winningBids])

  return (
    <Stack gap={4} className={classes.root}>
      <Title className={classes.title} order={1}>{t("dashboard.admin.permits.winners.title")}</Title>
      <Text className={classes.description}>{t("dashboard.admin.permits.winners.subtitle")}</Text>
      <WinnersTable bids={winningBids} />
    </Stack>
  )
}

export default Winners