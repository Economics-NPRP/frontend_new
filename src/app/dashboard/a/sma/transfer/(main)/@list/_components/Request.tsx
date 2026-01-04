import { Flex, Stack, Group, Title, Text, Button } from "@mantine/core"
import { Id } from "@/components/Id"
import { IconArrowNarrowRightDashed } from "@tabler/icons-react"
import { IPermitTransfer } from "@/schema/models/TransferRequestData"

const Request = ({ request }: { request: IPermitTransfer }) => {
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
        <Button>Review</Button>
      </Stack>
    </Flex>
  )
}

export default Request