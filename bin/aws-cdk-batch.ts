#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AwsCdkBatchStack } from "../lib/aws-cdk-batch-stack";

// config
import { account, region } from "../config.json";

const app = new cdk.App();
new AwsCdkBatchStack(app, "AwsCdkBatchStack", {
  env: {
    account,
    region,
  },
});
