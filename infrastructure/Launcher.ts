import { KingdomStack } from "./KingdomStack";
import { App } from "aws-cdk-lib";

const app = new App();
new KingdomStack(app, "kingdom-spotter", {
	stackName: "KingdomSpotter",
});
