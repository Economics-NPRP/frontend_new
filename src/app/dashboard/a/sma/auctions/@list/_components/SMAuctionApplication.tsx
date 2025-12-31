
import { IAuctionApplication } from "@/schema/models"
import { Flex, Stack, Card, Text, Button, Group } from "@mantine/core"
import { Id } from "@/components/Id"
import Image from "next/image"
import { AUCTION_IMAGE_PLACEHOLDER } from "./constants"
import { useSMAuctionAction } from "@/hooks"

import classes from "./styles.module.css"

const SMAuctionApplication = ({ application }: { application: IAuctionApplication }) => {
  const { approve, reject, execute } = useSMAuctionAction();

  return (
    <Flex className={classes.root}>
      <Card className={classes.card}>
        <Card.Section>
          <Image src={AUCTION_IMAGE_PLACEHOLDER} className="bg-red-400" alt="Auction Image" width={200} height={150} />
        </Card.Section>
        <Text className={classes.status}>{application.status}</Text>
      </Card>
      <Stack className={classes.info}>
        <Id
          variant="crn"
          value={application.auctionId}
        />
        <Text className={classes.title}>{"Auction Name"}</Text>
        <Text className={classes.desc}>{"Auction Description"}</Text>
      </Stack>
      <Stack justify="center">
        <Group>
          <Button
            color="green"
            onClick={() => approve.mutate({ auctionId: application.auctionId })}
            loading={approve.isPending}
          >
            Approve
          </Button>
          <Button
            color="red"
            variant="outline"
            onClick={() => reject.mutate({ auctionId: application.auctionId })}
            loading={reject.isPending}
          >
            Reject
          </Button>
          <Button
            color="blue"
            onClick={() => execute.mutate({ auctionId: application.auctionId })}
            loading={execute.isPending}
          >
            Execute
          </Button>
        </Group>
      </Stack>
    </Flex>
  )
}

export { SMAuctionApplication }