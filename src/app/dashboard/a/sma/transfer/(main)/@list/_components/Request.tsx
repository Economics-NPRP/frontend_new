'use client'
import { useContext } from "react"
import { Flex, Stack, Group, Title, Text, Button } from "@mantine/core"
import { Id } from "@/components/Id"
import { IconArrowNarrowRightDashed } from "@tabler/icons-react"
import { IPermitTransfer } from "@/schema/models/TransferRequestData"
import { ReviewTransferModalContext } from "@/pages/dashboard/a/sma/transfer/(main)/@list/_components/ReviewTransferModal"

const Request = ({ request }: { request: IPermitTransfer }) => {

  const { open } = useContext(ReviewTransferModalContext)

  return (
    <Flex>
      <Stack>
        <Id 
          variant="company"
          value={request.fromFirmId || "67676767676767"}
        />
        <Title className="heading-2" order={2}>Company Name</Title>
        <Text className="paragraph-md">This is the note sent by the requester</Text>
      </Stack>
      <Group>
        <Title className="heading-1" order={1}>999</Title>
        <Text className="paragraph-sm">permits</Text>
        <IconArrowNarrowRightDashed />
      </Group>
      <Stack>
        <Id 
          variant="company"
          value={request.toFirmId || "67676767676767"}
        />
        <Title className="heading-2" order={2}>Receiving Company</Title>
      </Stack>
      <Stack>
        <Button onClick={() => open(`${request.id}`)}>Review</Button>
      </Stack>
    </Flex>
  )
}

export default Request