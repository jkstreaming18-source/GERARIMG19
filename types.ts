
import React from 'react';

export type AppMode = 'create' | 'edit';

export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';

export interface FunctionPreset {
  id: string;
  name: string;
  // Fix: Import React to resolve 'React' namespace for type definition
  icon: React.ReactNode;
  requiresTwo?: boolean;
}

export interface GeneratedResult {
  url: string;
  prompt: string;
  mode: AppMode;
  function: string;
}
