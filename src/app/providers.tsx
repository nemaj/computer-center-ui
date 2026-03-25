'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { useEffect, useRef } from 'react';
import { generateInvoice } from '@/api/invoiceApi';

export function Providers({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; // prevent double call (React 18 dev)
    hasFetched.current = true;

    const generate = async () => {
      try {
        const res = await generateInvoice();
        if (res.status === 200) {
          return;
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    generate();
  }, []);

  return <Provider store={store}>{children}</Provider>
}