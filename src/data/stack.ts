export interface StackItem {
  label: string;
  years: number;
  tools: string[];
  confidence: number;
}

export const STACK: StackItem[] = [
  { label: 'React', years: 6, tools: ['Next.js', 'Redux', 'Zustand'], confidence: 5 },
  { label: 'React Native', years: 5, tools: ['MobX', 'Realm', 'Expo'], confidence: 5 },
  { label: 'TypeScript', years: 5, tools: [], confidence: 5 },
  { label: 'NestJS', years: 3, tools: ['Node.js'], confidence: 4 },
  { label: 'FastAPI', years: 2, tools: [], confidence: 3 },
];
