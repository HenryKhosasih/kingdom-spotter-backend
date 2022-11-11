import { join } from "node:path";

import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import {
	Code,
	Function as LambdaFunction,
	Runtime,
} from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class KingdomStack extends Stack {
	private api = new RestApi(this, "KingdomApi");
	private KingdomTable = new GenericTable(this, {
		tableName: "KingdomTable",
		primaryKey: "kingdomId",
		secondaryIndexes: ["location"],
		createLambdaPath: "Create",
		readLambdaPath: "Read",
	});

	constructor(scope?: Construct, id?: string, props?: StackProps) {
		super(scope, id, props);

		const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
			runtime: Runtime.NODEJS_16_X,
			entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
			handler: "handler",
		});

		const s3ListPolicy = new PolicyStatement();
		s3ListPolicy.addActions("s3:ListAllMyBuckets");
		s3ListPolicy.addResources("*");

		helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

		// Hello Api lambda integration
		const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
		const helloLambdaResource = this.api.root.addResource("hello");
		helloLambdaResource.addMethod("GET", helloLambdaIntegration);

		// Kingdom API integrations
		const kingdomResource = this.api.root.addResource("kingdom");
		kingdomResource.addMethod(
			"POST",
			this.KingdomTable.createLambdaIntegration
		);
		kingdomResource.addMethod("GET", this.KingdomTable.readLambdaIntegration);
	}
}
