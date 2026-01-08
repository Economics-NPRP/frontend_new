
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
    className={classes.root}
  >
    <Card padding={0} className={classes.card}>
      <Card.Section>
        <Image src={AUCTION_IMAGE_PLACEHOLDER} className="w-full object-cover" alt="Auction Image" width={350} height={350*(9/16)} />
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
    </Card>
  </UnstyledButton>
  )
}

export { SMAuctionApplication }