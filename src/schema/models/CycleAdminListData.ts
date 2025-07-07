import { array, nonEmpty, pipe } from 'valibot';

import { BaseCycleAdminDataSchema, CreateCycleAdminDataSchema } from './CycleAdminData';

//	TODO: add nonEmpty once adding admins is implemented for creating auction cycle
export const BaseCycleAdminListDataSchema = pipe(array(BaseCycleAdminDataSchema));
export const CreateCycleAdminListDataSchema = pipe(array(CreateCycleAdminDataSchema));
