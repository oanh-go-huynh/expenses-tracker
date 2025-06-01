import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplifyAlpha from '@aws-cdk/aws-amplify-alpha'; 

interface FrontendAppStackProps extends cdk.StackProps {
  backendLoadBalancerDns: string;
}

export class FrontendAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendAppStackProps) {
    super(scope, id, props);


    const amplifyApp = new amplifyAlpha.App(this, 'ExpensesFrontendApp', {
      appName: 'expenses-app-frontend',
      sourceCodeProvider: new amplifyAlpha.GitHubSourceCodeProvider({
        owner: 'YOUR_GITHUB_USERNAME', 
        repository: 'YOUR_FRONTEND_REPO_NAME', 
        oauthToken: cdk.SecretValue.secretsManager('YOUR_GITHUB_TOKEN_SECRET_NAME'), 
      }),
      environmentVariables: {
        'NEXT_PUBLIC_GRAPHQL_ENDPOINT': `http://${props.backendLoadBalancerDns}/graphql`,
      },
      autoBranchCreation: {
        patterns: ['feature/*', 'feat/*'],
      },
      autoBranchDeletion: true,
    });

    const mainBranch = amplifyApp.addBranch('main', { 
      stage: 'PRODUCTION', 
    });
    
    new cdk.CfnOutput(this, 'AmplifyAppId', { value: amplifyApp.appId });
    new cdk.CfnOutput(this, 'FrontendURL', { value: `https://${mainBranch.branchName}.${amplifyApp.appId}.amplifyapp.com` }); 
  }
}