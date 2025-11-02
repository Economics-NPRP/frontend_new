"use client"
import { Group, Grid, Flex, Stack, Container, Title, Text, Anchor, Button } from "@mantine/core"
import { IconUser } from "@tabler/icons-react"
import { Id } from "@/components/Id"
import classes from "./styles.module.css"
import { WithSkeleton } from "@/components/WithSkeleton"

type PermitsWonProps = {
  bid: {
    id: string;
    companyName: string;
    owner: string;
    bids: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      locked: number;
      expired: number;
    }
  },
  loading: boolean;
}
const PermitsWon = ({ bid, loading }: PermitsWonProps) => {

  const statuses = [
    { label: 'Approved', value: bid.bids.approved },
    { label: 'Pending', value: bid.bids.pending },
    { label: 'Rejected', value: bid.bids.rejected },
    { label: 'Locked', value: bid.bids.locked },
    { label: 'Expired', value: bid.bids.expired },
  ]

  return (
    <Group justify="space-between" className={classes.permitsWon}>
      <Stack gap={0} flex={1} className={classes.text}>
        <WithSkeleton loading={loading} height={14} width={100} className="mb-1">
          <Id
            variant="company"
            value={bid.id}
          />
        </WithSkeleton>
        <WithSkeleton loading={loading} height={24} width={200} className="mb-2">
          <Anchor className="block no-underline" href={`/companies/${bid.id}`}>
            <Title className={classes.name} order={2}>{bid.companyName}</Title>
          </Anchor>
        </WithSkeleton>
        <WithSkeleton loading={loading} height={16} width={150} className="mb-3">
          <Flex align={"center"} className={classes.owner} gap={2}>
            <IconUser size={14} />
            <Text className={classes.name} span>{bid.owner}</Text>
          </Flex>
        </WithSkeleton>
        <WithSkeleton loading={loading} height={24} width={80}>
          <Text className={classes.total + " mt-2"}>
            <Text span className={classes.value}>{bid.bids.total}</Text>
            &nbsp;<Text span className={classes.label}>Permits Won</Text>
          </Text>
        </WithSkeleton>
      </Stack>
      <Flex justify="space-around" flex={2} className={classes.statistics}>
        {statuses.map((status) => (
          <Stack key={status.label} align="center" gap={0} className={classes.status}>
            <Text className={classes.label + " mb-2"}>{status.label}</Text>
            <Text className={classes.value}>{status.value}</Text>
            <Text className={classes.unit}>Permits</Text>
          </Stack>
        ))}
      </Flex>
      <Grid columns={2} flex={1.25} gutter={0} className={classes.grid}>
        <Grid.Col className={classes.col} span={1}>
          <Container className={`${classes.buttonContainer} ${classes.approve}`}>
            <Button
              className={classes.button}
              disabled={loading}
              variant="white"
              color="green.9"
            >
              Approve
            </Button>
          </Container>
          <Container className={`${classes.buttonContainer} ${classes.lock}`}>
            <Button
              className={classes.button}
              disabled={loading}
              variant="white"
              color="gray.7"
            >
              Lock
            </Button>
          </Container>
        </Grid.Col>
        <Grid.Col className={classes.col} span={1}>
          <Container className={`${classes.buttonContainer} ${classes.reject}`}>
            <Button
              className={classes.button}
              disabled={loading}
              variant="white"
              color="red.9"
            >
              Reject
            </Button>
          </Container>
          <Container className={`${classes.buttonContainer} ${classes.expire}`}>
            <Button
              className={classes.button}
              disabled={loading}
              variant="white"
              color="yellow.9"
            >
              Force Expire
            </Button>
          </Container>
        </Grid.Col>
      </Grid>
    </Group>
  )
}

// Generate some demo data in an array with 10 items
const demoData = Array.from({ length: 10 }, (_, index) => ({
  id: `0984756908360987`,
  companyName: `Company ${index}`,
  owner: `Owner ${index}`,
  bids: {
    total: Math.floor(Math.random() * 100),
    approved: Math.floor(Math.random() * 100),
    pending: Math.floor(Math.random() * 100),
    rejected: Math.floor(Math.random() * 100),
    locked: Math.floor(Math.random() * 100),
    expired: Math.floor(Math.random() * 100),
  }
}));

export { PermitsWon, demoData }