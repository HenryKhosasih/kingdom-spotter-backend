import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/KingdomTable/Delete";

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		kingdomId: "a3d3921d-6980-424b-9c6b-418f9974b236",
	},
} as any;

const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body);
	console.log("inside handler");
});
