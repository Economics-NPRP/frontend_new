'use client'
import { useContext } from "react"
import { Flex, Stack, Group, Title, Text, Button } from "@mantine/core"
import { Id } from "@/components/Id"
import { IconArrowNarrowRightDashed, IconNote } from "@tabler/icons-react"
import { IPermitTransfer } from "@/schema/models/TransferRequestData"
import { ReviewTransferModalContext } from "@/pages/dashboard/a/sma/transfer/(main)/@list/_components/ReviewTransferModal"
import { DateTime } from "luxon"

import classes from "./styles.module.css"

const Request = ({ request }: { request: IPermitTransfer }) => {

  const { open } = useContext(ReviewTransferModalContext)

  return (
    <Flex className={classes.request}>
      <Stack className={classes.firmFrom}>
        <Id 
          variant="company"
          value={request.fromFirmId || "67676767676767"}
        />
        <Title className="heading-2" order={2}>Company Name</Title>
        <Group gap={6}>
          <IconNote className="opacity-50" size={14} />
          <Text className="paragraph-sm">This is the note sent by the requester</Text>
        </Group>
      </Stack>
      <Group className={classes.permits}>
        <IconArrowNarrowRightDashed className="opacity-60" />
        <Group className={classes.text}>
          <Title className="heading-1" order={1}>999</Title>
          <Text className="paragraph-sm">permits</Text>
        </Group>
        <IconArrowNarrowRightDashed />
      </Group>
      <Stack className={classes.firmTo}>
        <Id 
          variant="company"
          value={request.toFirmId || "67676767676767"}
        />
        <Title className="heading-2" order={2}>Receiving Company</Title>
        <Text className={classes.requestedAt}>Requested at: <time>{DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}</time></Text>
      </Stack>
      <Stack className={classes.review}>
        <Button className={classes.button} variant="white" onClick={() => open(`${request.id}`)}>Review</Button>
      </Stack>
    </Flex>
  )
}

export default Request