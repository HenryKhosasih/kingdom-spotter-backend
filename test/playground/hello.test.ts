import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/KingdomTable/Read";

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		location: "Kulger",
	},
} as any;

const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body);
	console.log("inside handler");
});
