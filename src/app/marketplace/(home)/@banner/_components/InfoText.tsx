import { Container } from "@mantine/core"
import classes from './styles.module.css'
import { WithSkeleton } from '@/components/WithSkeleton';

interface IInfoTextProps {
  text: string;
  loading?:boolean;
}

export const InfoText = ({
  text,
  loading=false
}: IInfoTextProps) => {
  return (
    <Container className={classes.infoText}>
        <WithSkeleton
          loading={loading}
          height={16}
          width={200}
          my={6}
        >
        {text}
      </WithSkeleton>
    </Container>
  )
}