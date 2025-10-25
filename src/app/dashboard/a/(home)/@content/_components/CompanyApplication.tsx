import classes from "./styles.module.css"
import { SectorType } from "@/schema/models";
import { useMatches } from "@mantine/core";
import { Id } from '@/components/Id';
import { Group, Stack, Text, Box, Anchor } from "@mantine/core"
import { Switch } from "@/components/SwitchCase";
import { WithSkeleton } from "@/components/WithSkeleton";
import { IconDotsCircleHorizontal, IconCheck, IconX } from "@tabler/icons-react";

type CompanyApplicationProps = {
  companyName: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  crn: string;
  sectors: SectorType[];
  loading: boolean;
}

const CompanyApplication = ({
  companyName,
  applicationDate,
  status,
  crn,
  sectors,
  loading=true
}:CompanyApplicationProps) => {

  const truncate = useMatches({ base: false, xs: true, sm: false, md: true, lg: false });

  return (
    <Anchor style={{ textDecoration: 'none' }} href={`/dashboard/a/firms/applications`}>
      <Group gap={48} className={classes.companyApplication}>
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
      </Group>
    </Anchor>
  )
}

export { CompanyApplication }