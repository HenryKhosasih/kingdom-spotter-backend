import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/KingdomTable/Read";

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		kingdomId: "825f48eb-b42f-4050-9546-9c147d33e47a",
	},
} as any;

const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body);
	console.log("inside handler");
});
