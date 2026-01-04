'use client';

import { createContext } from 'react';

export const DefaultReviewPermitsModalContextData: IReviewPermitsModalContext = {
  open: () => { },
  close: () => { },
  firmId: '',
};

export interface IReviewPermitsModalContext {
  open: (firmId: string) => void;
  close: () => void;
  firmId: string;
}

export const ReviewPermitsModalContext = createContext<IReviewPermitsModalContext>(
  DefaultReviewPermitsModalContextData,
);
