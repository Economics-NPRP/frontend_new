import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AdminRoleSchema = pipe(
	picklist(['manager', 'auctionOperator', 'permitStrategist', 'financeOfficer']),
	nonEmpty(),
);

export type AdminRole = InferOutput<typeof AdminRoleSchema>;
