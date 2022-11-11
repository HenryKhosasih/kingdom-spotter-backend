import { DynamoDB } from "aws-sdk";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
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
		if (event.queryStringParameters) {
			if (PRIMARY_KEY! in event.queryStringParameters) {
				const value = event.queryStringParameters[PRIMARY_KEY!];
				const queryResponse = await dbClient
					.query({
						TableName: TABLE_NAME!,
						KeyConditionExpression: "#k = :v",
						ExpressionAttributeNames: {
							"#k": PRIMARY_KEY!,
						},
						ExpressionAttributeValues: {
							":v": value,
						},
					})
					.promise();
					result.body = JSON.stringify(queryResponse)
			}
		} else {
			const queryResponse = await dbClient
				.scan({
					TableName: TABLE_NAME!,
				})
				.promise();
			result.body = JSON.stringify(queryResponse);
		}
	} catch (error) {
		if (error instanceof Error) {
			result.body = error.message;
		}
	}

	return result;
}

export { handler };
