"use client"
import { Group, Grid, Flex, Stack, Container, Title, Text, Anchor, Button, Checkbox } from "@mantine/core"
import { IconUser } from "@tabler/icons-react"
import { Id } from "@/components/Id"
import classes from "./styles.module.css"
import { WithSkeleton } from "@/components/WithSkeleton"
import { IBidData } from "@/schema/models"
import { useContext } from "react"
import { ReviewPermitsModalContext } from "./ReviewPermitsModal"

type PermitsWonProps = {
  bid: {
    id: string;
    bidId?: string;
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
  className?: string;
  select: (bid: IBidData | typeof demoData[0], checked: boolean) => void;
}
const PermitsWon = ({ bid, loading, select, className }: PermitsWonProps) => {
  const { open } = useContext(ReviewPermitsModalContext);

  const statuses = [
    { label: 'Total', value: bid.bids.total },
    { label: 'Pending', value: bid.bids.pending },
    { label: 'Approved', value: bid.bids.approved },
    { label: 'Rejected', value: bid.bids.rejected },
  ]

  return (
    <Group justify="space-between" className={`${classes.permitsWon} ${className}`}>
      <Group className={classes.text} flex={1}>
        <Checkbox onChange={e => {
          select(bid, e.currentTarget.checked);
        }} />
        <Stack gap={0}>
          <WithSkeleton loading={loading} height={14} width={100} className="mb-1">
            <Id
              variant="company"
              value={bid.id}
            />
          </WithSkeleton>
          <WithSkeleton loading={loading} height={24} width={200} className="mb-2">
            <Anchor className="block no-underline" href={`/dashboard/a/firms/${bid.id}`}>
              <Title className={classes.name} order={2}>{bid.companyName}</Title>
            </Anchor>
          </WithSkeleton>
          <WithSkeleton loading={loading} height={16} width={150} className="mb-3">
            <Flex align={"center"} className={classes.owner} gap={2}>
              <IconUser className={classes.icon} size={14} />
              <Text className={classes.name} span>{bid.owner}</Text>
            </Flex>
          </WithSkeleton>
        </Stack>
      </Group>
      <Flex justify="center" gap={64} flex={2} className={classes.statistics}>
        {statuses.map((status) => (
          <Stack key={status.label} align="center" gap={0} className={classes.status}>
            <Text className={classes.label + " mb-2"}>{status.label}</Text>
            <Text className={classes.value}>{status.value}</Text>
            <Text className={classes.unit}>Permits</Text>
          </Stack>
        ))}
      </Flex>
      <Container flex={1} className={`${classes.buttonContainer} ${classes.review}`}>
        <Button
          className={classes.button}
          disabled={loading}
          variant="white"
          color="gray.7"
          onClick={() => bid.id && open(bid.id)}
        >
          Review Permits
        </Button>
      </Container>
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