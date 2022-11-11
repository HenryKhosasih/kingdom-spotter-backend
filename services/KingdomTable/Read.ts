import { DynamoDB } from "aws-sdk";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyEventQueryStringParameters,
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
				result.body = await queryWithPrimaryPartition(
					event.queryStringParameters
				);
			} else {
				result.body = await queryWithSecondaryPartition(
					event.queryStringParameters
				);
			}
		} else {
			result.body = await scanTable();
		}
	} catch (error) {
		if (error instanceof Error) {
			result.body = error.message;
		}
	}

	return result;
}

async function queryWithPrimaryPartition(
	queryParams: APIGatewayProxyEventQueryStringParameters
) {
	const value = queryParams[PRIMARY_KEY!];
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
	return JSON.stringify(queryResponse.Items);
}

async function queryWithSecondaryPartition(
	queryParams: APIGatewayProxyEventQueryStringParameters
) {
	const queryKey = Object.keys(queryParams)[0];
	const queryValue = queryParams[queryKey];
	const queryResponse = await dbClient
		.query({
			TableName: TABLE_NAME!,
			IndexName: queryKey,
			KeyConditionExpression: "#k = :v",
			ExpressionAttributeNames: {
				"#k": queryKey,
			},
			ExpressionAttributeValues: {
				":v": queryValue,
			},
		})
		.promise();
	return JSON.stringify(queryResponse.Items);
}

async function scanTable() {
	const queryResponse = await dbClient
		.scan({
			TableName: TABLE_NAME!,
		})
		.promise();
	return JSON.stringify(queryResponse.Items);
}

export { handler };
