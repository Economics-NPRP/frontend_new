
import { IAuctionApplication } from "@/schema/models"
import { Stack, Card, Text, Container, UnstyledButton } from "@mantine/core"
import { Id } from "@/components/Id"
import Image from "next/image"
import { AUCTION_IMAGE_PLACEHOLDER } from "./constants"


import { SectorBadge } from "@/components/Badge"

import classes from "./styles.module.css"
import Link from "next/link"

const SMAuctionApplication = ({ application }: { application: IAuctionApplication }) => {

  return (
  <UnstyledButton
    component={Link}
    href={`/dashboard/a/sma/auctions/${application.auctionId}`}
  >
    <Card padding={0} className={classes.root}>
      <Card.Section>
        <Image src={AUCTION_IMAGE_PLACEHOLDER} className="bg-red-400" alt="Auction Image" width={350} height={350*(9/16)} />
      </Card.Section>
      <Stack className={classes.info}>
        <Id
          variant="crn"
          value={application.auctionId}
        />
        <Text className={classes.title}>{"Auction Name"}</Text>
        <Text className={classes.desc}>{"Auction Description"}</Text>
        <SectorBadge
          sector={'energy'}
        />
      </Stack>
      <Container className={`${classes.statusContainer} ${classes[application.status.toLowerCase()]}`}>
        <Text className={classes.status}>{application.status}</Text>
      </Container>
      <Stack justify="center">

        {/* <Group>
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
        </Group> */}
      </Stack>
    </Card>
  </UnstyledButton>
  )
}

export { SMAuctionApplication }