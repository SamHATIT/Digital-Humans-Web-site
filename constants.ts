import {
    BusinessAnalystIcon,
    ArchitectIcon,
    DeveloperIcon,
    QAEgineerIcon,
    DevOpsIcon,
    DataMigrationIcon,
    TrainerIcon,
    SpeedIcon,
    AccuracyIcon,
    CostIcon,
    DocsIcon
} from './components/icons';
import type { Agent, Step, Benefit } from './types';

export const AGENTS: Agent[] = [
    { name: 'Business Analyst', role: 'Defines requirements and scope.', icon: BusinessAnalystIcon },
    { name: 'Solution Architect', role: 'Designs the optimal Salesforce solution.', icon: ArchitectIcon },
    { name: 'Apex Developer', role: 'Writes robust backend logic.', icon: DeveloperIcon },
    { name: 'LWC Developer', role: 'Builds modern, responsive UI.', icon: DeveloperIcon },
    { name: 'Administrator', role: 'Configures Salesforce declaratively.', icon: ArchitectIcon },
    { name: 'QA Engineer', role: 'Ensures quality and performance.', icon: QAEgineerIcon },
    { name: 'DevOps Engineer', role: 'Manages CI/CD and deployment.', icon: DevOpsIcon },
    { name: 'Data Migration Specialist', role: 'Handles complex data transfers.', icon: DataMigrationIcon },
    { name: 'Trainer', role: 'Creates user-training materials.', icon: TrainerIcon },
];

export const HOW_IT_WORKS_STEPS: Step[] = [
    {
        title: 'AI-Powered Analysis',
        description: 'Our AI Business Analyst ingests your requirements and generates a comprehensive technical specification, often over 100 pages.',
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
    { title: 'Accelerated Delivery', description: 'Reduce project timelines from months to weeks with 24/7 AI-driven development.', icon: SpeedIcon },
    { title: 'Enhanced Accuracy', description: 'Minimize human error with systematic, AI-managed code and configuration.', icon: AccuracyIcon },
    { title: 'Reduced Costs', description: 'Lower consulting fees and total cost of ownership through efficient automation.', icon: CostIcon },
    { title: 'Comprehensive Documentation', description: 'Receive exhaustive, machine-generated documentation for every project.', icon: DocsIcon },
];