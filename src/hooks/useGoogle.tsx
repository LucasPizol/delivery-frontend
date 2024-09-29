import React, { createContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

interface ContextProps {
  isLoaded: boolean;
}

const GoogleContext = createContext<ContextProps>(null as any);

export const GoogleProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIQCMREEdBU8sYNPegNX6sYsfvNYCWgXY",
    libraries: ["places"],
  });

  return (
    <GoogleContext.Provider
      value={{
        isLoaded,
      }}
    >
      {children}
    </GoogleContext.Provider>
  );
};

export const useGoogle = () => {
  const context = React.useContext(GoogleContext);

  if (!context) {
    throw new Error("useGoogle must be used within an AuthProvider");
  }

  return context;
};
