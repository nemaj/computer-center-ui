'use client'

import { generateInvoice } from "@/api/invoiceApi";
import React, { createContext, useEffect, useRef } from "react";

export const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
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

  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};