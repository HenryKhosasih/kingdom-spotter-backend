import { DynamoDB } from "aws-sdk";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";
import { getEventBody } from "../Shared/Utils";

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
		const requestBody = getEventBody(event);

		const kingdomId = event.queryStringParameters?.[PRIMARY_KEY];

		if (requestBody && kingdomId) {
			const requestBodyKey = Object.keys(requestBody)[0];
			const requestBodyValue = requestBody[requestBodyKey];

			const updateResult = await dbClient
				.update({
					TableName: TABLE_NAME,
					Key: {
						[PRIMARY_KEY]: kingdomId,
					},
					UpdateExpression: "set #k = :v",
					ExpressionAttributeNames: {
						"#k": requestBodyKey,
					},
					ExpressionAttributeValues: {
						":v": requestBodyValue,
					},
					ReturnValues: "UPDATED_NEW",
				})
				.promise();

			result.body = JSON.stringify(updateResult);
		}
	} catch (error) {
		if (error instanceof Error) {
			result.body = error.message;
		}
	}

	return result;
}

export { handler };
