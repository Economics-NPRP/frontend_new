'use client';
import { useState, useContext, PropsWithChildren } from 'react';
import { Modal, ModalProps, Text, Button, Textarea, useModalsStack, Group, Stack, Title, Flex, Input } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { ReviewPermitsModalContext } from './constants';
import classes from './styles.module.css';
import { useQueryState } from 'nuqs';
import { useTransferApproval } from 'hooks/useTransferApproval';

export const ReviewPermitsModal = ({ className, ...props }: ModalProps) => {
  const t = useTranslations();

  const [requestId, _] = useQueryState("requestId")

  const { close, firmId } = useContext(ReviewPermitsModalContext);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (isNaN(value) || value < 1) {
      return;
    } else {
      setQuantity(value);
    }
  }

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const { transferAction } = useTransferApproval(close);

  return (
    <Modal
      classNames={{
        root: `${classes.root} ${className}`,
        inner: classes.inner,
        content: classes.content,
        body: classes.body,
      }}
      withCloseButton={false}
      centered
      {...props}
    >
      <Stack gap="md">
        <Title order={3} className={classes.heading}>Review Permit Transfer</Title>
        <Text className={classes.description}>
          {t('dashboard.admin.transfer.review.description')}
        </Text>
        <Text className={classes.text}>{t('dashboard.admin.permits.review.quantity')}</Text>
        <Flex>
          <Button onClick={handleDecrement} variant='white' className={classes.decrement}>-</Button>
          <Input className='w-full' value={quantity} onChange={handleQuantityChange} />
          <Button onClick={handleIncrement} variant='white' className={classes.increment}>+</Button>
        </Flex>
        <Text className={classes.text}>{t('dashboard.admin.transfer.review.note')}</Text>
        <Textarea
          placeholder="Write your note here..."
          className={classes.notes}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />

        <Group grow>
          <Button
            color="red"
            variant="outline"
            onClick={() => reject.mutate({
              firmId, quantity, notes
            })}
            loading={reject.isPending}
          >
            Reject
          </Button>
          <Button
            color="green"
            onClick={() => accept.mutate({
              firmId, quantity, notes
            })}
            loading={accept.isPending}
          >
            Approve
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export const ReviewPermitsModalProvider = ({ children }: PropsWithChildren) => {
  const stack = useModalsStack(['root']);
  const [firmId, setFirmId] = useState<string>('');

  return (
    <ReviewPermitsModalContext.Provider
      value={{
        open: (firmId) => {
          setFirmId(firmId);
          stack.open('root');
        },
        close: () => stack.close('root'),
        firmId,
      }}
    >
      {children}
      <Modal.Stack>
        <ReviewPermitsModal {...stack.register('root')} />
      </Modal.Stack>
    </ReviewPermitsModalContext.Provider>
  );
};
