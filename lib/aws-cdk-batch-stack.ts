import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as batch from "@aws-cdk/aws-batch";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as config from "../config.json";
import { Duration } from "@aws-cdk/core";

export class AwsCdkBatchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = __dirname.split("/")[__dirname.split("/").length - 2];

    // VPC setting
    // 1. Using existing VPC
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

    // TODO: 이미 존재하는 리포지토리이면, 이미지를 추가만 하고 싶고, 존재하지 않으면 리포지토리를 만들고 싶음.. trycatch? Cfn.output?
    // ECR setting
    let ecrRepo;
    try {
      ecrRepo = ecr.Repository.fromRepositoryName(
        this,
        "getExistingRepo",
        projectName
      );
    } catch (error) {
      // 1. Making repository
      const repoName = new ecr.Repository(this, "makeRepo", {
        repositoryName: projectName,
      });
      // 2. Adding lifecycle rule
      repoName.addLifecycleRule({
        tagPrefixList: ["lastest"],
        maxImageAge: Duration.days(30),
        maxImageCount: 999,
      });
      // 3. Getting repo made ready
      ecrRepo = ecr.Repository.fromRepositoryName(
        this,
        "getEcrRepo",
        projectName
      );
    }

    // Add containers to a task definition
    const container = fargateTaskDefinition.addContainer("AddContainer", {
      containerName: "martin",
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
    });
  }
}
