import { Stack, Text } from "@mantine/core"

import { InfoBoxLabel, InfoBoxIcons } from "./constants";
import type { TInfoBoxIcons } from "./constants";

import classes from "./styles.module.css"

type IInfoBoxProps = {
  variant: 'auction' | 'energy' | 'industry' | 'transport' | 'buildings' | 'waste' | 'agriculture';
  value: number;
}

export const InfoBox = ({ variant, value }: IInfoBoxProps) => {
  const Icon: TInfoBoxIcons[typeof variant] = InfoBoxIcons[variant];

  return (
    <Stack align="center" gap={0} className={`${classes.infoBox} ${classes[variant]}`}>
      <Icon className={classes.icon} size={28} />
      <Text className={classes.label}>{InfoBoxLabel[variant]}</Text>
      <Text className={classes.value}>{value}</Text>
    </Stack>
  )
}