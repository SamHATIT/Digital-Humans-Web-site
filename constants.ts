import {
    BusinessAnalystIcon,
    ArchitectIcon,
    DeveloperIcon,
    QAEgineerIcon,
    DevOpsIcon,
    SpeedIcon,
    AccuracyIcon,
    CostIcon,
    SecurityIcon
} from './components/icons';
import type { Agent, Step, Benefit } from './types';

export const AGENTS: Agent[] = [
    { firstName: 'Sophie', role: 'Project Manager', description: 'Your key partner for aligning vision, team and results.', avatar: '/avatars/sophie-pm.png' },
    { firstName: 'Olivia', role: 'Business Analyst', description: 'Defines requirements and scope.', avatar: '/avatars/olivia-ba.png' },
    { firstName: 'Marcus', role: 'Solution Architect', description: 'Designs the optimal Salesforce solution.', avatar: '/avatars/marcus-architect.png' },
    { firstName: 'Diego', role: 'Apex Developer', description: 'Writes robust backend logic.', avatar: '/avatars/diego-apex.png' },
    { firstName: 'Zara', role: 'LWC Developer', description: 'Builds modern, responsive UI.', avatar: '/avatars/zara-lwc.png' },
    { firstName: 'Raj', role: 'Administrator', description: 'Configures Salesforce declaratively.', avatar: '/avatars/raj-admin.png' },
    { firstName: 'Elena', role: 'QA Engineer', description: 'Ensures quality and performance.', avatar: '/avatars/elena-qa.png' },
    { firstName: 'Jordan', role: 'DevOps Engineer', description: 'Manages CI/CD and deployment.', avatar: '/avatars/jordan-devops.png' },
    { firstName: 'Aisha', role: 'Data Migration Specialist', description: 'Handles complex data transfers.', avatar: '/avatars/aisha-data.png' },
    { firstName: 'Lucas', role: 'Trainer', description: 'Creates user-training materials.', avatar: '/avatars/lucas-trainer.png' },
];

export const HOW_IT_WORKS_STEPS: Step[] = [
    {
        title: 'AI-Powered Analysis',
        description: 'Our AI Business Analyst & Solution Architect ingest your requirements and generate a comprehensive project specification, based on Salesforce Best Practices.',
        icon: BusinessAnalystIcon,
    },
    {
        title: 'Client Validation',
        description: 'You review and approve the detailed documentation, ensuring perfect alignment before a single line of code is written.',
        icon: QAEgineerIcon,
    },
    {
        title: 'Automated Development',
        description: 'Our multi-agent team collaborates to build, configure, and test your solution with unparalleled speed and precision.',
        icon: DeveloperIcon,
    },
    {
        title: 'Seamless Deployment',
        description: 'The AI DevOps Engineer packages and deploys the solution directly to your Salesforce org using modern SFDX practices.',
        icon: DevOpsIcon,
    },
];

export const BENEFITS: Benefit[] = [
    { title: 'Accelerated Delivery', description: 'Reduce project timelines from months to days with 24/7 AI-driven development.', icon: SpeedIcon },
    { title: 'Enhanced Accuracy', description: 'Minimize human error with systematic, AI-managed code, configuration & documentation.', icon: AccuracyIcon },
    { title: 'Reduced Costs', description: 'Lower consulting fees and total cost of ownership through efficient automation.', icon: CostIcon },
    { title: 'Transparency & Security', description: 'All interactions are logged and traceable. You set the rules and control them.', icon: SecurityIcon },
];