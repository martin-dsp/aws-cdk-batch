import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as batch from "@aws-cdk/aws-batch";
import * as ecs from "@aws-cdk/aws-ecs";
import * as config from "../config.json";

export class AwsCdkBatchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 기존 VPC 활용
    const vpc = ec2.Vpc.fromLookup(this, "getExistingVPC", {
      vpcName: config.vpcName,
    });

    // ECS Cluster 생성
    const cluster = ecs.Cluster.fromClusterArn(
      this,
      "getExistingCluster",
      config.clusterArn
    );

    // Task definition
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "makeNewTaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );

    // Add containers to a task definition
    const container = fargateTaskDefinition.addContainer("AddContainer", {
      containerName: "martin",
      image: ecs.ContainerImage.fromEcrRepository({
        // TODO: 야 이거 왜 안되는거야...
        repositoryUri: config.EcrRepositoryUri,
      }),
    });
  }
}
