import { handler } from "../../services/KingdomTable/Create";

const event = {
	body: {
		location: "Poluto",
	},
};

handler(event as any, {} as any);
