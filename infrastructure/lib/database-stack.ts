import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class DatabaseStack extends cdk.Stack {
  public readonly dbCluster: rds.DatabaseCluster;
  public readonly dbCredentialsSecret: secretsmanager.ISecret;
  public readonly dbSecurityGroup: ec2.SecurityGroup;
  public readonly defaultDatabaseName: string; // <-- ADD THIS PROPERTY

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    this.dbCredentialsSecret = new secretsmanager.Secret(this, 'DBCredentialsSecret', {
      secretName: `expenses-app/db-credentials/${cdk.Aws.STACK_NAME}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'expensesadmin' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
        passwordLength: 16,
      },
    });

    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSG', {
      vpc: props.vpc,
      description: 'Security group for Aurora PostgreSQL cluster',
      allowAllOutbound: true,
    });

    this.defaultDatabaseName = 'expenses_db'; 

    this.dbCluster = new rds.DatabaseCluster(this, 'AuroraExpensesDB', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_3, 
      }),
      credentials: rds.Credentials.fromSecret(this.dbCredentialsSecret),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      defaultDatabaseName: this.defaultDatabaseName, 
      securityGroups: [this.dbSecurityGroup],
      storageEncrypted: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'DBClusterEndpoint', { value: this.dbCluster.clusterEndpoint.hostname });
    new cdk.CfnOutput(this, 'DBCredentialsSecretArn', { value: this.dbCredentialsSecret.secretArn });
  }
}