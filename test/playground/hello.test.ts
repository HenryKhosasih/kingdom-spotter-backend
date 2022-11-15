import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/KingdomTable/Create";

const event: APIGatewayProxyEvent = {
	body: {
		name: "testName",
		location: "testLocation",
	},
} as any;

const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body);
	console.log("inside handler");
});
