import classes from "./styles.module.css"
import { SectorType } from "@/schema/models";
import { useMatches } from "@mantine/core";
import { Id } from '@/components/Id';
import { Flex, Group, Stack, Text, Box, Anchor } from "@mantine/core"
import { Switch } from "@/components/SwitchCase";
import { WithSkeleton } from "@/components/WithSkeleton";
import { IconDotsCircleHorizontal, IconCheck, IconX, IconDots } from "@tabler/icons-react";
import { SectorBadge } from "@/components/Badge";

type CompanyApplicationProps = {
  companyName: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  crn: string;
  sectors: SectorType[];
  loading: boolean;
  key: string;
}

const CompanyApplication = ({
  companyName,
  applicationDate,
  status,
  crn,
  sectors,
  loading=true,
  key
}:CompanyApplicationProps) => {

  const truncate = useMatches({ base: false, xs: true, sm: false, md: true, lg: false });

  return crn ? (
    <Anchor key={key} style={{ textDecoration: 'none', width: '100%' }} href={`/dashboard/a/firms/applications`}>
      <Flex justify="space-between" className={classes.companyApplication}>
        <Stack justify="flex-start" flex={1} gap={0} className={classes.information}>
          <WithSkeleton loading={loading} height={14} width={100}>
            <Id 
              variant="crn"
              includeHash={false}
              value={crn}
              truncate={truncate}
              className={classes.id}
            />
          </WithSkeleton>
          <WithSkeleton
            loading={loading}
            height={24}
            width={150}
          >
            <Text className={classes.name}>{companyName}</Text>
          </WithSkeleton>
          <WithSkeleton
            loading={loading}
            height={16}
            width={150}
          >
            <Text className={classes.date}>Registered on: {applicationDate}</Text>
          </WithSkeleton>
          <Group gap={8} className={classes.sectors}>
            {sectors && sectors.length > 0 && 
              sectors.map(sector => (
                <SectorBadge 
                  key={sector}
                  sector={sector}
                />
            ))}
          </Group>
        </Stack>
        <Stack className={classes.statusContainer} justify="center" align="center" gap={4}>
          <Text className={classes.label}>Status</Text>
          <Switch value={status}>
            <Switch.Case when="pending">
              <Box px={32} py={4} w={"fit-content"} className={`${classes.status} ${classes.pending}`}>
                <IconDotsCircleHorizontal size={14} className={classes.iconPending} />
                <Text className={classes.text}>
                  {status}
                </Text>
              </Box>
            </Switch.Case>
            <Switch.Case when="approved">
              <Box px={32} py={4} w={"fit-content"} className={`${classes.status} ${classes.approved}`}>
                <IconCheck size={14} className={classes.iconApproved} />
                <Text className={classes.text}>
                  {status}
                </Text>
              </Box>
            </Switch.Case>
            <Switch.Case when="rejected">
              <Box px={32} py={4} w={"fit-content"} className={`${classes.status} ${classes.rejected}`}>
                <IconX size={14} className={classes.iconRejected} />
                <Text className={classes.text}>
                  {status}
                </Text>
              </Box>
            </Switch.Case>
          </Switch>
        </Stack>
      </Flex>
    </Anchor>
  ) : loading ? (
    <>
      <Stack align="center" gap={16} className={classes.fallback}>
        <IconDots size={32} />
        <Text span>Loading Firm Applications...</Text>
      </Stack>
    </>
  ) : (
    <>
      <Stack align="center" gap={16} className={classes.fallback}>
        <IconCheck size={32} />
        <Text span>All Applications Have Been Reviewed</Text>
      </Stack>
    </>
  )
}

export { CompanyApplication }