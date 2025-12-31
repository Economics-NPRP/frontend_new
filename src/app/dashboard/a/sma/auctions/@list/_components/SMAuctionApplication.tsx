
import { IAuctionApplication } from "@/schema/models"
import { Flex, Stack, Card, Text } from "@mantine/core"
import { Id } from "@/components/Id"
import Image from "next/image"

const SMAuctionApplication = ({ application }: { application: IAuctionApplication }) => {
  return (
    <Flex>
      <Card>
        <Card.Section>
          <Image src={"https://via.placeholder.com/150"} alt="Auction Image" />
        </Card.Section>
        <Text>{application.status}</Text>
      </Card>
      <Stack>
        <Id 
          variant="crn"
          value={application.auctionId}
        />
        <Text>{"Auction Name"}</Text>
        <Text>{"Auction Description"}</Text>
      </Stack>
    </Flex>
  )
}

export { SMAuctionApplication }