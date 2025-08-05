import React, { useRef, useEffect } from "react";
import FloatingInput from "../FloatingInput";

export function formatIban(value: string): string {
  let cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

export function validateIban(iban: string): string {
  const cleaned = iban.replace(/[^A-Za-z0-9]/g, "");
  if (!/^DE[0-9A-Za-z]{20}$/.test(cleaned)) {
    return "Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Zeichen).";
  }
  return "";
}

type SEPAStepProps = {
  sepa: {
    agb: boolean;
    widerruf: boolean;
    datenschutz: boolean;
    kontoinhaber: string;
    iban: string;
  };
  ibanError: string;
  ibanBankName: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
};

const SEPAStep: React.FC<SEPAStepProps> = ({
  sepa,
  ibanError,
  ibanBankName,
  onInputChange,
  onCheckboxChange,
  t,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <form className="grid grid-cols-3 gap-x-4 gap-y-2">
      <div className="col-span-3 mb-2">
        <input
          type="checkbox"
          id="agb"
          name="agb"
          checked={sepa.agb}
          onChange={onCheckboxChange}
          className="mr-2"
          required
        />
        <label htmlFor="agb" className="font-medium">
          {t("sepa.agb1")}{" "}
          <a
            href="https://www.kitaweb-bw.de/kita/datei/436709/Nutzungsbedingungen_Betreuung_Januar_2024.PDF"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sepa.agb2")}
          </a>{" "}
          {t("sepa.agb3")}
        </label>
      </div>
      <div className="col-span-3 mb-2">
        <input
          type="checkbox"
          id="widerruf"
          name="widerruf"
          checked={sepa.widerruf}
          onChange={onCheckboxChange}
          className="mr-2"
          required
        />
        <label htmlFor="widerruf" className="font-medium">
          {t("sepa.widerruf1")}{" "}
          <a
            href="https://www.kitaweb-bw.de/kita/datei/436709/Datenschutzerkl%C3%A4ung_Stadt_Bad_Waldsee.PDF"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sepa.widerruf2")}
          </a>{" "}
          {t("sepa.widerruf3")}
        </label>
      </div>
      <div className="col-span-3 mb-2">
        <input
          type="checkbox"
          id="datenschutz"
          name="datenschutz"
          checked={sepa.datenschutz}
          onChange={onCheckboxChange}
          className="mr-2"
          required
        />
        <label htmlFor="sepaZustimmung" className="font-medium">
          {t("sepa.datenschutz1")}{" "}
          <a
            href="https://www.kitaweb-bw.de/kita/datei/436709/Hinweise_zum_SEPA_Mandat_Mai_2025.PDF"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sepa.datenschutz2")}
          </a>
          {t("sepa.datenschutz3")}
        </label>
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("sepa.kontoinhaber")}
          name="kontoinhaber"
          required
          value={sepa.kontoinhaber}
          onChange={onInputChange}
          ref={inputRef}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("sepa.iban")}
          name="iban"
          required
          value={sepa.iban}
          onChange={onInputChange}
          maxLength={27}
        />
        {ibanError && (
          <div className="text-red-600 text-sm mt-1">{ibanError}</div>
        )}
        {ibanBankName && !ibanError && (
          <div className="text-green-700 text-sm mt-1">
            {t("sepa.bank")}: {ibanBankName}
          </div>
        )}
      </div>
    </form>
  );
};

export default SEPAStep;
