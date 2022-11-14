import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import {
	AuthorizationType,
	LambdaIntegration,
	MethodOptions,
	RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { join } from "node:path";
import { GenericTable } from "./GenericTable";
import { AuthorizerWrapper } from "./auth/AuthorizerWrapper";

export class KingdomStack extends Stack {
	private api = new RestApi(this, "KingdomApi");
	private authorizer: AuthorizerWrapper;

	private KingdomTable = new GenericTable(this, {
		tableName: "KingdomTable",
		primaryKey: "kingdomId",
		secondaryIndexes: ["location"],
		createLambdaPath: "Create",
		readLambdaPath: "Read",
		updateLambdaPath: "Update",
		deleteLambdaPath: "Delete",
	});

	constructor(scope?: Construct, id?: string, props?: StackProps) {
		super(scope, id, props);

		this.authorizer = new AuthorizerWrapper(this, this.api);

		const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
			entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
			handler: "handler",
		});
		const s3ListPolicy = new PolicyStatement();
		s3ListPolicy.addActions("s3:ListAllMyBuckets");
		s3ListPolicy.addResources("*");
		helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

		const optionsWithAuthorizer: MethodOptions = {
			authorizationType: AuthorizationType.COGNITO,
			authorizer: {
				authorizerId: this.authorizer.authorizer.authorizerId,
			},
		};

		// Hello API lambda integration:
		const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
		const helloLambdaResource = this.api.root.addResource("hello");
		helloLambdaResource.addMethod(
			"GET",
			helloLambdaIntegration, optionsWithAuthorizer
		);

		// Kingdom API integrations
		const kingdomResource = this.api.root.addResource("kingdom");

		kingdomResource.addMethod("GET", this.KingdomTable.readLambdaIntegration);
		kingdomResource.addMethod(
			"POST",
			this.KingdomTable.createLambdaIntegration
		);
		kingdomResource.addMethod("PUT", this.KingdomTable.updateLambdaIntegration);
		kingdomResource.addMethod(
			"DELETE",
			this.KingdomTable.deleteLambdaIntegration
		);
	}
}
