import React from "react";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"] as Libraries;

export const GoogleProvider = ({ children }: { children: React.ReactNode }) => {
  useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });

  return children;
};
