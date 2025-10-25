import { Group, Stack, Text, Pill, Box } from "@mantine/core"
import { IconDotsCircleHorizontal, IconCheck, IconX } from "@tabler/icons-react";
import classes from "./styles.module.css"

type CompanyApplicationProps = {
  companyName: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  crn: string;
}

const CompanyApplication = ({
  companyName,
  applicationDate,
  status,
  crn
}:CompanyApplicationProps) => {
  return (
    <Group className={classes.companyApplication}>
      <Stack className={classes.information}>
        <Text className={classes.crn}># CRN: {crn}</Text>
        <Text className={classes.name}>{companyName}</Text>
        <Text className={classes.date}>Registered on: {applicationDate}</Text>
      </Stack>
      <Stack>
        <Text className={classes.label}>Status:</Text>
        <Box className={classes.status}>
          <Text>{status}</Text>
        </Box>
      </Stack>
    </Group>
  )
}

export default CompanyApplication