import { App, GitHubSourceCodeProvider } from "@aws-cdk/aws-amplify-alpha";
import { Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Application } from "aws-cdk-lib/aws-appconfig";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { Construct } from "constructs";

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const amplifyAppName = "FovusApp";
      const amplifyApp = new App(this, amplifyAppName, {
          environmentVariables: {
              AMPLIFY_MONOREPO_APP_ROOT: "frontend",
          },
          sourceCodeProvider: new GitHubSourceCodeProvider({
              owner: "b-zapata",
              repository: "fovusApp",
              oauthToken: cdk.SecretValue.secretsManager("github-token"),
          }),
          buildSpec: BuildSpec.fromObjectToYaml({
              version: "1.0",
              applications: [
                  {
                      frontend: {
                          phases: {
                              preBuild: {
                                  commands: ["npm ci"],
                              },
                              build: {
                                  commands: ["npm run build"],
                              },
                          },
                          artifacts: {
                              baseDirectory: "build",
                          },
                          cache: {
                              paths: ["node_modules/**/**"],
                          },
                          appRoot: "frontend",
                      },
                  },
              ],
          }),
      });

      const mainBranch = amplifyApp.addBranch("frontend");

  }
}
