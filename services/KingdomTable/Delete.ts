import { DynamoDB } from "aws-sdk";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
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
		const kingdomId = event.queryStringParameters?.[PRIMARY_KEY];

		if (kingdomId) {
			const deleteResult = await dbClient
				.delete({
					TableName: TABLE_NAME,
					Key: {
						[PRIMARY_KEY]: kingdomId,
					},
					ReturnValues: "ALL_OLD",
				})
				.promise();

			result.body = JSON.stringify(deleteResult);
		}
	} catch (error) {
		if (error instanceof Error) {
			result.body = error.message;
		}
	}

	return result;
}

export { handler };
