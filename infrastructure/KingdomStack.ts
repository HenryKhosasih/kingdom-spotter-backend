import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";

import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";

export class KingdomStack extends Stack {
	private api = new RestApi(this, "KingdomApi");
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
