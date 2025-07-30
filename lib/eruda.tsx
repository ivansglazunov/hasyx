'use client';

import { useEffect } from "react";

export function Eruda() {
  useEffect(() => {
    try {
      import('eruda').then(eruda => eruda?.default?.init());
    } catch(e) {}
  }, []);

  return null;
} 