import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as batch from "@aws-cdk/aws-batch";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import { Duration } from "@aws-cdk/core";

// config
import {
  vpcName,
  clusterArn,
  memoryLimitMiB,
  cpu,
  maxvCpus,
} from "../config.json";

// TODO: 동작하는지 확인해봐야 함
const PROJECT_NAME = __dirname.split("/")[__dirname.split("/").length - 2];

// TODO: 이미 존재하는 경우 나중에...
// -> repo 등 초기셋팅 npm 명령어 한개
// -> 수정할 때 쓰는 npm 명령어 한개 만들어야 하나?!
export class AwsCdkBatchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC setting
    // 1. Using existing VPC
    const vpc = ec2.Vpc.fromLookup(this, "readExistingVPC", {
      vpcName,
    });

    // Fargate Compute Environment setting
    const fargateEnvironment = new batch.ComputeEnvironment(
      this,
      "createEnvironment",
      {
        computeEnvironmentName: `${PROJECT_NAME}-compute-environment`,
        computeResources: {
          vpc,
          maxvCpus,
          type: batch.ComputeResourceType.FARGATE,
        },
      }
    );

    // Job Queue setting
    const jobQueue = new batch.JobQueue(this, "createJobQueue", {
      jobQueueName: `${PROJECT_NAME}-job-queue`,
      computeEnvironments: [
        {
          computeEnvironment: fargateEnvironment,
          order: 1,
        },
      ],
      priority: 1,
    });

    /* 
      A Batch Job definition helps AWS Batch understand important details 
      about how to run your application in the scope of a Batch Job. 
      This involves key information like 
      resource requirements, what containers to run, how the compute environment should be prepared, and more
    */
    // Job Definition
    // 1. Reading repo made ready
    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      "readEcrRepo",
      PROJECT_NAME
    );
    // 2. Making job
    const job = new batch.JobDefinition(this, "createJobDefinition", {
      container: {
        image: new ecs.EcrImage(ecrRepo, "latest"),
      },
    });

    // // 1. ECR setting
    // const repo = new ecr.Repository(this, "createEcrRepository", {
    //   repositoryName: PROJECT_NAME,
    // });
    // // 2. Adding lifecycle rule
    // repo.addLifecycleRule({
    //   tagPrefixList: ["latest"],
    //   maxImageAge: Duration.days(30),
    //   maxImageCount: 999,
    // });

    // // Task definition
    // const fargateTaskDefinition = new ecs.FargateTaskDefinition(
    //   this,
    //   "createTaskDefinition",
    //   {
    //     memoryLimitMiB,
    //     cpu,
    //   }
    // );

    // // ECS Cluster setting
    // // 1. Using existing Cluster
    // const cluster = ecs.Cluster.fromClusterArn(
    //   this,
    //   "readExistingCluster",
    //   clusterArn
    // );

    // // Add containers to a task definition
    // const container = fargateTaskDefinition.addContainer("AddContainer", {
    //   containerName: "martin",
    //   image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
    // });
  }
}
