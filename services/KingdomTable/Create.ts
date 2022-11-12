import { DynamoDB } from "aws-sdk";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";
import { v4 } from "uuid";
import {
	MissingFieldError,
	validateAsKingdomInput,
} from "../Shared/InputValidator";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> {
	const result = {
		statusCode: 200,
		body: "Hello from DynamoDB",
	};

	try {
		const item =
			typeof event.body === "object" ? event.body : JSON.parse(event.body);
		item.kingdomId = v4();
		validateAsKingdomInput(item);

		await dbClient
			.put({
				TableName: TABLE_NAME!,
				Item: item,
			})
			.promise();
		result.body = JSON.stringify(`Created item with id: ${item.kingdomId}`);
	} catch (error) {
		if (error instanceof Error) {
			result.statusCode = error instanceof MissingFieldError ? 403 : 500;
			result.body = error.message;
		}
	}

	return result;
}

export { handler };
