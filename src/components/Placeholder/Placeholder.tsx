import { Text } from "@mantine/core"
import { IconDots } from "@tabler/icons-react"
import classes from "./styles.module.css"

interface IPlaceholder {
  state: "loading" | "error"
  message?: string
}

const Placeholder = ({ state, message }:IPlaceholder) => {
  return (
    <Text className={classes.placeholder}>
      <IconDots className={classes.icon} size={32} />
      <Text className={classes.text} span>{state === "loading" && !message ? "Loading..." : message}</Text>
    </Text>
  )
}

export default Placeholder