import { Stack, Title, Text, Divider } from "@mantine/core"

import classes from "./styles.module.css"

const NotFound = () => {
  return (
    <Stack gap={0} className={classes.notFound}>
      <Title className={classes.title}>Coming Soon</Title>
      <Divider c="gray.5" mt={12} mb={16} w={250} />
      <Text className={classes.text}>This page is under development.</Text>
    </Stack>
  )
}

export default NotFound