import { array, nonEmpty, pipe } from 'valibot';

import { BaseCycleAdminDataSchema, CreateCycleAdminDataSchema } from './CycleAdminData';

export const BaseCycleAdminListDataSchema = pipe(array(BaseCycleAdminDataSchema), nonEmpty());
export const CreateCycleAdminListDataSchema = pipe(array(CreateCycleAdminDataSchema), nonEmpty());
