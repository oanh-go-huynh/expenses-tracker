import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as rds from 'aws-cdk-lib/aws-rds'; 
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';

interface BackendAppStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbCluster: rds.IDatabaseCluster; 
  dbCredentialsSecret: secretsmanager.ISecret;
  defaultDatabaseName: string; 
  redisEndpointAddress: string;
  redisEndpointPort: string;
  redisSecurityGroup: ec2.ISecurityGroup;
  backendRepository: ecr.IRepository;
}

export class BackendAppStack extends cdk.Stack {
  public readonly backendLoadBalancerDns: string;

  constructor(scope: Construct, id: string, props: BackendAppStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'AppCluster', {
      vpc: props.vpc,
      containerInsights: true,
    });

    const jwtSecret = new secretsmanager.Secret(this, 'JwtSecret', {
        secretName: `expenses-app/jwt-secret/${cdk.Aws.STACK_NAME}`,
        description: 'JWT secret for the expenses app',
        generateSecretString: {
            passwordLength: 32,
            excludePunctuation: true,
        }
    });

    const taskLogGroup = new logs.LogGroup(this, 'BackendTaskLogGroup', {
      logGroupName: `/ecs/expenses-app-backend/${cdk.Aws.STACK_NAME}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'BackendTaskDef', {
        memoryLimitMiB: 512,
        cpu: 256,
        runtimePlatform: {
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
            cpuArchitecture: ecs.CpuArchitecture.X86_64, 
        },
    });

    taskDefinition.addContainer('BackendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.backendRepository, 'latest'), 
      containerName: 'expenses-backend-container',
      portMappings: [{ containerPort: 3000 }],
      environment: {
        PORT: '3000',
        DB_HOST: props.dbCluster.clusterEndpoint.hostname,
        DB_PORT: props.dbCluster.clusterEndpoint.port.toString(),
        DB_NAME: props.defaultDatabaseName, 
        REDIS_HOST: props.redisEndpointAddress,
        REDIS_PORT: props.redisEndpointPort,
      },
      secrets: { 
        DB_USER: ecs.Secret.fromSecretsManager(props.dbCredentialsSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.dbCredentialsSecret, 'password'),
        JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret, 'secret'), 
      },
      logging: new ecs.AwsLogDriver({
        logGroup: taskLogGroup,
        streamPrefix: 'backend-service',
      }),
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'BackendFargateService', {
      cluster,
      taskDefinition,
      publicLoadBalancer: true, 
      desiredCount: 1,        
      listenerPort: 80,       
      circuitBreaker: { rollback: true },
    });

    fargateService.targetGroup.configureHealthCheck({
        path: "/graphql", 
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
        healthyHttpCodes: "200,400" 
    });

    props.dbCluster.connections.allowDefaultPortFrom(fargateService.service.connections);
    fargateService.service.connections.allowTo(props.redisSecurityGroup, ec2.Port.tcp(Number(props.redisEndpointPort)));

    this.backendLoadBalancerDns = fargateService.loadBalancer.loadBalancerDnsName;
    new cdk.CfnOutput(this, 'BackendURL', { value: `http://${this.backendLoadBalancerDns}` });
  }
}