'use client'
import { Flex, Box } from "@mantine/core"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

import classes from "./styles.module.css"

const CurrentCycle = () => {

  const t = useTranslations()
  const [ownership, _] = useQueryState('ownership')
  if (ownership !== 'government') return null
  return (
    <Flex className={classes.cycle}>
      {/* End time */}
      {/* Cycle name, ID, Description */}
      {/* Total Number of auctions */}
      {/* Number of auctions in my sector */}
    </Flex>
  )
}

export default CurrentCycle