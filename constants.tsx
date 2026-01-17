
import React from 'react';
import { FunctionPreset } from './types';

export const CREATE_PRESETS: FunctionPreset[] = [
  {
    id: 'free',
    name: 'Prompt',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16M6 3h12v14H6z"/><path d="M8 7h8M8 11h8"/>
      </svg>
    )
  },
  {
    id: 'sticker',
    name: 'Figura',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l7 7v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"/>
        <path d="M14 3v5a2 2 0 0 0 2 2h5"/>
      </svg>
    )
  },
  {
    id: 'text',
    name: 'Logo',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M10 6v12M14 6v12M6 18h12"/>
      </svg>
    )
  },
  {
    id: 'comic',
    name: 'Desenho',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h12v10H3z"/><path d="M15 7l6-2v10l-6 2z"/><path d="M5 9h8M5 12h6"/>
      </svg>
    )
  }
];

export const EDIT_PRESETS: FunctionPreset[] = [
  {
    id: 'add-remove',
    name: 'Adicionar',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    )
  },
  {
    id: 'retouch',
    name: 'Retoque',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22l6-6"/><path d="M3 16l5 5"/><path d="M14.5 2.5l7 7-9.5 9.5H5v-7z"/>
      </svg>
    )
  },
  {
    id: 'style',
    name: 'Estilo',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a7 7 0 1 1-10.8-8.4"/>
      </svg>
    )
  },
  {
    id: 'compose',
    name: 'Mesclar',
    requiresTwo: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="10" height="10" rx="1"/><rect x="11" y="3" width="10" height="10" rx="1"/>
      </svg>
    )
  }
];
