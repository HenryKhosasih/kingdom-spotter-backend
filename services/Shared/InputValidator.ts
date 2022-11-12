import { Kingdom } from "./Model";

export class MissingFieldError extends Error {}

export function validateAsKingdomInput(arg: any) {
	if (!(arg as Kingdom).kingdomId)
		throw new MissingFieldError("Kingdom ID value is required");
	if (!(arg as Kingdom).name)
		throw new MissingFieldError("Name value is required");
	if (!(arg as Kingdom).location)
		throw new MissingFieldError("Location value is required");
}
