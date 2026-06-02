import { createContext, useContext, useState, ReactNode } from "react";

export type NecVersion = "2017" | "2020" | "2023" | "2026";

interface NecVersionContextType {
  version: NecVersion;
  setVersion: (v: NecVersion) => void;
}

const NecVersionContext = createContext<NecVersionContextType>({
  version: "2023",
  setVersion: () => {},
});

export function NecVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<NecVersion>("2023");
  return (
    <NecVersionContext.Provider value={{ version, setVersion }}>
      {children}
    </NecVersionContext.Provider>
  );
}

export function useNecVersion() {
  return useContext(NecVersionContext);
}
