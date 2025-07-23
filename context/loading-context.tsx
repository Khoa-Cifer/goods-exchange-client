"use client"

import { setGlobalLoadingHandler } from "@/lib/loading-helper";
import React, { createContext, useContext, useEffect, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: (value: boolean) => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setGlobalLoadingHandler(setLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
