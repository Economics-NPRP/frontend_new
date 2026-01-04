'use client';

import { createContext } from 'react';

export const DefaultReviewTransferModalContextData: IReviewTransferModalContext = {
  open: () => { },
  close: () => { },
  requestId: '',
};

export interface IReviewTransferModalContext {
  open: (requestId: string) => void;
  close: () => void;
  requestId: string;
}

export const ReviewTransferModalContext = createContext<IReviewTransferModalContext>(
  DefaultReviewTransferModalContextData,
);
