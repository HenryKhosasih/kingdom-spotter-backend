import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/KingdomTable/Update";

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		kingdomId: "58340c53-df0a-4678-8ffc-6e001dfd3775",
	},
	body: {
		location: "Verusky",
	},
} as any;

const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body);
	console.log("inside handler");
});
