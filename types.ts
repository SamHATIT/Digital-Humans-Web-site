// FIX: Import React to make the React namespace available for type definitions.
import type React from 'react';

export interface Agent {
  firstName: string;
  role: string;
  description: string;
  avatar: string;
}

export interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Benefit {
  title: string;
  description: string;
  icon: React.ElementType;
}
