import { IconCheck, IconX, IconDots } from '@tabler/icons-react';
import classes from './styles.module.css'

type ChartIconProps = {
  data: {
    accepted: number;
    rejected: number;
    pending: number;
  };
  status: 'accepted' | 'rejected' | 'pending';
  radius?: number;
  name?: string;
}

const ChartIcon = ({
  data,
  status,
  radius = 8,
  name = '',
}: ChartIconProps) => {

  const total = Object.values(data).reduce((acc, val) => acc + val, 0);
  const thetaMargin = status === 'accepted' ? 0 : status === 'pending' ? data['accepted'] : data['accepted'] + data['pending'];
  const theta = ((data[status] + (thetaMargin * 2)) / total) * 2 * Math.PI;
  const x = (50+radius) * Math.cos(theta/2);
  const y = (50+radius) * Math.sin(theta/2);

  return (
    <div 
      className={classes.chartIcon}
      style={{
        display: (data[status] / total) > 0.1 ? 'block' : 'none',
        marginLeft: x+"%",
        marginBottom: y+"%",
        width: radius*2,
        height: radius*2,
      }}
    >
      {
        status === 'accepted' ? (
          <IconCheck className={classes.icon} size={radius * 2} />
        ) :
        status === 'pending' ? (
          <IconDots className={classes.icon} size={radius * 2} />
        ) : (
          <IconX className={classes.icon} size={radius * 2} />
        )
      }
    </div>
  )
}

export { ChartIcon }