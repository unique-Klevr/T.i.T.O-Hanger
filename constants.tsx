
import React from 'react';

export const STATUS_COLORS: Record<string, string> = {
  'dropped': 'bg-emerald-500',
  'skipped': 'bg-amber-500',
  'no-soliciting': 'bg-rose-500',
  'existing-client': 'bg-sky-500',
};

export const STATUS_HEX = {
  'dropped': '#10b981',
  'skipped': '#f59e0b',
  'no-soliciting': '#f43f5e',
  'existing-client': '#0ea5e9',
};

export const STATUS_LABELS: Record<string, string> = {
  'dropped': 'Hanger Dropped',
  'skipped': 'Skipped',
  'no-soliciting': 'No Soliciting',
  'existing-client': 'Existing Client',
};

export const MOCK_CREW: any[] = [
  { id: '1', name: 'Alex Thompson', drops: 145 },
  { id: '2', name: 'Jordan Reed', drops: 122 },
  { id: '3', name: 'Casey Miller', drops: 98 },
];
