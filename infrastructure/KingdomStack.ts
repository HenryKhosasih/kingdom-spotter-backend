import { join } from "node:path";

import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import {
	Code,
	Function as LambdaFunction,
	Runtime,
} from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class KingdomStack extends Stack {
	private api = new RestApi(this, "KingdomApi");

	constructor(scope?: Construct, id?: string, props?: StackProps) {
		super(scope, id, props);

		const helloLambda = new LambdaFunction(this, "helloLambda", {
			runtime: Runtime.NODEJS_16_X,
			code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
			handler: "hello.main",
		});

		// Hello Api lambda integration
		const helloLambdaIntegration = new LambdaIntegration(helloLambda);
		const helloLambdaResource = this.api.root.addResource("hello");
		helloLambdaResource.addMethod("GET", helloLambdaIntegration);
	}
}
