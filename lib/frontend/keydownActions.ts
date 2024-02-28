import { KeyboardEvent } from 'react';
import { isMac, isWindows } from './getPlatform';

export function ctrlSAction (cb?: () => void) {
  return (e: KeyboardEvent) => {
    if (!((isWindows() && e.ctrlKey) || (isMac() && e.metaKey)) || e.code !== 'KeyS') return;
    e.preventDefault();
    cb && cb();
  };
}

export function preventAccidentSubmitAction() {
  return (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };
}
