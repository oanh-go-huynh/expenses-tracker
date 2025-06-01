import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcrStack extends cdk.Stack {
  public readonly backendRepository: ecr.Repository;
  public readonly frontendRepository: ecr.Repository; 

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.backendRepository = new ecr.Repository(this, 'BackendRepository', {
      repositoryName: 'expenses-app/backend',
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
    });


    this.frontendRepository = new ecr.Repository(this, 'FrontendRepository', {
      repositoryName: 'expenses-app/frontend',
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'BackendRepositoryUri', { value: this.backendRepository.repositoryUri });
    new cdk.CfnOutput(this, 'FrontendRepositoryUri', { value: this.frontendRepository.repositoryUri });
  }
}