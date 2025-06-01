import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { DatabaseStack } from '../lib/database-stack';
import { CacheStack } from '../lib/cache-stack';
import { EcrStack } from '../lib/ecr-stack';
import { BackendAppStack } from '../lib/backend-app-stack';
import { FrontendAppStack } from '../lib/frontend-app-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcStack = new VpcStack(app, 'ExpensesAppVpcStack', { env });
const databaseStack = new DatabaseStack(app, 'ExpensesAppDatabaseStack', {
  vpc: vpcStack.vpc,
  env,
});
const cacheStack = new CacheStack(app, 'ExpensesAppCacheStack', {
  vpc: vpcStack.vpc,
  dbSecurityGroup: databaseStack.dbSecurityGroup, 
  env,
});
const ecrStack = new EcrStack(app, 'ExpensesAppEcrStack', { env });

const backendAppStack = new BackendAppStack(app, 'ExpensesAppBackendStack', {
  vpc: vpcStack.vpc,
  dbCluster: databaseStack.dbCluster,
  dbCredentialsSecret: databaseStack.dbCredentialsSecret,
  defaultDatabaseName: databaseStack.defaultDatabaseName, 
  redisEndpointAddress: cacheStack.redisCluster.attrRedisEndpointAddress,
  redisEndpointPort: cacheStack.redisCluster.attrRedisEndpointPort,
  redisSecurityGroup: cacheStack.redisSecurityGroup,
  backendRepository: ecrStack.backendRepository,
  env,
});
backendAppStack.addDependency(databaseStack);
backendAppStack.addDependency(cacheStack);

const frontendAppStack = new FrontendAppStack(app, 'ExpensesAppFrontendStack', {
  backendLoadBalancerDns: backendAppStack.backendLoadBalancerDns,
  env,
});
frontendAppStack.addDependency(backendAppStack);

app.synth();