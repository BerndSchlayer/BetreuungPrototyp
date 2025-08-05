import React, { useRef, useEffect } from "react";
import FloatingSelect from "../FloatingSelect";
import FloatingInput from "../FloatingInput";

type NotesStepProps = {
  hinweise: {
    betreuungsart: string;
    abholName?: string;
    buslinie?: string;
    nimmtMedikamente: boolean;
    medikamente?: string;
    hatUnvertraeglichkeiten: boolean;
    unvertraeglichkeiten?: string;
  };
  isAbholRelevant: boolean;
  isBusRelevant: boolean;
  handleHinweiseSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleHinweiseInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
};

const NotesStep: React.FC<NotesStepProps> = ({
  hinweise,
  isAbholRelevant,
  isBusRelevant,
  handleHinweiseSelectChange,
  handleHinweiseInputChange,
  t,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    selectRef.current?.focus();
  }, []);
  return (
    <form className="grid grid-cols-3 gap-x-4 gap-y-2">
      <div className="col-span-3">
        <FloatingSelect
          label={t("notes.betreuungsart")}
          name="betreuungsart"
          options={[
            { label: t("notes.selbststaendig"), value: "selbständig" },
            { label: t("notes.abholung"), value: "Abholung" },
            { label: t("notes.bus"), value: "Bus" },
          ]}
          value={hinweise.betreuungsart}
          onChange={handleHinweiseSelectChange}
          ref={selectRef}
        />
      </div>
      {isAbholRelevant && (
        <div className="col-span-3">
          <FloatingInput
            label={t("notes.abholName")}
            name="abholName"
            required
            value={hinweise.abholName || ""}
            onChange={handleHinweiseInputChange}
          />
        </div>
      )}
      {isBusRelevant && (
        <div className="col-span-3">
          <FloatingInput
            label={t("notes.buslinie")}
            name="buslinie"
            required
            value={hinweise.buslinie || ""}
            onChange={handleHinweiseInputChange}
          />
        </div>
      )}
      <div className="col-span-3 flex items-center mt-2">
        <input
          type="checkbox"
          id="nimmtMedikamente"
          name="nimmtMedikamente"
          checked={!!hinweise.nimmtMedikamente}
          onChange={handleHinweiseInputChange}
          className="mr-2"
        />
        <label htmlFor="nimmtMedikamente" className="font-medium">
          {t("notes.nimmtMedikamente")}
        </label>
      </div>
      {hinweise.nimmtMedikamente && (
        <div className="col-span-3">
          <FloatingInput
            label={t("notes.medikamente")}
            name="medikamente"
            required
            value={hinweise.medikamente || ""}
            onChange={handleHinweiseInputChange}
          />
        </div>
      )}
      <div className="col-span-3 flex items-center mt-2">
        <input
          type="checkbox"
          id="hatUnvertraeglichkeiten"
          name="hatUnvertraeglichkeiten"
          checked={!!hinweise.hatUnvertraeglichkeiten}
          onChange={handleHinweiseInputChange}
          className="mr-2"
        />
        <label htmlFor="hatUnvertraeglichkeiten" className="font-medium">
          {t("notes.hatUnvertraeglichkeiten")}
        </label>
      </div>
      {hinweise.hatUnvertraeglichkeiten && (
        <div className="col-span-3">
          <FloatingInput
            label={t("notes.unvertraeglichkeiten")}
            name="unvertraeglichkeiten"
            required
            value={hinweise.unvertraeglichkeiten || ""}
            onChange={handleHinweiseInputChange}
          />
        </div>
      )}
    </form>
  );
};

export default NotesStep;
