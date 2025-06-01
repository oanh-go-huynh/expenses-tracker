import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

interface CacheStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbSecurityGroup: ec2.ISecurityGroup; 
}

export class CacheStack extends cdk.Stack {
  public readonly redisCluster: elasticache.CfnCacheCluster;
  public readonly redisSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: CacheStackProps) {
    super(scope, id, props);

    this.redisSecurityGroup = new ec2.SecurityGroup(this, 'RedisSG', {
      vpc: props.vpc,
      description: 'Security group for ElastiCache Redis cluster',
      allowAllOutbound: true,
    });

    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for the Redis cluster',
      subnetIds: props.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
      cacheSubnetGroupName: `expenses-redis-subnet-${cdk.Aws.STACK_NAME}`,
    });

    this.redisCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      engine: 'redis',
      cacheNodeType: 'cache.t3.micro', 
      numCacheNodes: 1,
      vpcSecurityGroupIds: [this.redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName,
      clusterName: `expenses-redis-${cdk.Aws.STACK_NAME}`,
      port: 6379,
    });
    this.redisCluster.addDependency(subnetGroup);


    new cdk.CfnOutput(this, 'RedisEndpointAddress', { value: this.redisCluster.attrRedisEndpointAddress || 'N/A' });
    new cdk.CfnOutput(this, 'RedisEndpointPort', { value: this.redisCluster.attrRedisEndpointPort || 'N/A' });
  }
}