import { APIGatewayProxyEvent } from "aws-lambda";
import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: any, context: any) {
	console.log("Got an event:");
	console.log(event);

	if (isAuthorized(event)) {
		return {
			statusCode: 200,
			body: JSON.stringify("You are authorized as Admins"),
		};
	} else {
		return {
			statusCode: 401,
			body: JSON.stringify("You are not authorized"),
		};
	}
}

function isAuthorized(event: APIGatewayProxyEvent) {
	const groups = event.requestContext.authorizer?.claims["cognito:groups"];

	if (groups) {
		return (groups as string).includes("admins");
	}

	return false;
}

export { handler };
