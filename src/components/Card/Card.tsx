import { Stack, Group, Title, Tooltip } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react";
import classes from "./styles.module.css"

type CardProps = {
  title: string;
  tooltip?: string;
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card = ({ tooltip, title, size, children }: CardProps) => {
  return (
    <Stack className={`${classes.card} ${classes[size]}`}>
      <Group className={classes.header} justify="space-between" align="center">
        <Title className={classes.title} order={4}>{title}</Title>
        {tooltip && (
          <Tooltip label={tooltip} disabled={!tooltip}>
            <IconInfoCircle className={classes.icon} size={16} />
          </Tooltip>
        )}
      </Group>
      {children}
    </Stack>
  )
}

export default Card