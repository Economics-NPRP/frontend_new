'use client'
import { Flex, Box, Stack, Text } from "@mantine/core"
import { useTranslations, useLocale } from "next-intl"
import { useQueryState } from "nuqs"
import { MediumCountdown } from "@/components/Countdown"
import { Id } from "@/components/Id"

import { DateTime } from "luxon"

import { InfoBox } from "./_components"

import classes from "./styles.module.css"

const CurrentCycle = () => {

  const t = useTranslations()
  const locale = useLocale()

  const [ownership, _] = useQueryState('ownership')

  const startDate = DateTime.fromObject({ year: 2025, month: 11, day: 6, hour: 15, minute: 30 }).setLocale(locale);
  

  if (ownership === 'private' || startDate > DateTime.now()) return null

  return (
    <Flex className={classes.cycle}>
      <Stack className={classes.endTime}>
        <Text className={classes.text}>{t('marketplace.home.cycle.endTime')}</Text>
        <Box className={classes.countdown}>
          <MediumCountdown
            targetDate={new Date(2026, 10, 6, 15, 30).toISOString()} // Month is 0-indexed
          />
        </Box>
      </Stack>
      {/* Cycle name, ID, Description */}
      <Box className={classes.details}>
        <Id
          variant="auctionCycle"
          value={"345345345345"}
        />
        <Text className={classes.title}>{"Current Cycle - Extended"}</Text>
        <Text className={classes.description}>{"This is the current auction cycle and has a lot of auctions."}</Text>
      </Box>
      <Flex className={classes.auctions}>
        <InfoBox
          variant="auction"
          value={25}
        />
        <InfoBox
          variant="energy"
          value={12}
        />
      </Flex>
    </Flex>
  )
}

export default CurrentCycle