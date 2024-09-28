import { Autocomplete } from "@react-google-maps/api";
import { CSSProperties, useEffect, useState } from "react";
import { Input } from "../ui/input";

export interface GoogleAddressProps {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface GoogleAutoAddressFieldProps {
  address: GoogleAddressProps | null;
  setAddress: React.Dispatch<React.SetStateAction<GoogleAddressProps | null>>;
  inputStyle?: CSSProperties;
  loading?: boolean;
}

export const GoogleAutoAddressField = ({
  address,
  setAddress,
  inputStyle,
}: GoogleAutoAddressFieldProps) => {
  const [inputValue, setInputValue] = useState<string>();

  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    if (address) setInputValue(address.address);
    if (!address) setInputValue("");
  }, [address]);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (!place) {
        return;
      }

      const { formatted_address, geometry } = place;

      if (!formatted_address) {
        return;
      }

      if (!geometry?.location) {
        return;
      }

      const lat = geometry.location.lat();
      const lng = geometry.location.lng();

      if (!lat || !lng) {
        return;
      }

      setAddress({
        address: formatted_address,
        coordinates: {
          lat,
          lng,
        },
      });
      setInputValue(formatted_address);
    }
  };

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <div
      style={{
        zIndex: 9999,
      }}
    >
      <Autocomplete
        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
        onPlaceChanged={onPlaceChanged}
        restrictions={{ country: "br" }}
        fields={["geometry.location", "formatted_address"]}
      >
        <Input
          type="text"
          placeholder="Coloque o endereço aqui"
          className="ant-input"
          style={inputStyle}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Autocomplete>
    </div>
  );
};
