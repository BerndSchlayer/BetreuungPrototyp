import React, { useRef, useEffect } from "react";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import DateInput from "../DateInput";

type ChildStepProps = {
  child: {
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    geschlecht: string;
    schule: string;
    klasse: string;
  };
  angeboteMatrix: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (value: string | null) => void;
  t: (key: string) => string;
};

const ChildStep: React.FC<ChildStepProps> = ({
  child,
  angeboteMatrix,
  onInputChange,
  onSelectChange,
  onDateChange,
  t,
}) => {
  // Lokale Ref für das Vorname-Feld
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <form className="grid grid-cols-3 gap-x-4 gap-y-2">
      <div className="col-span-3">
        <FloatingInput
          label={t("child.vorname")}
          name="vorname"
          required
          value={child.vorname}
          onChange={onInputChange}
          ref={inputRef}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("child.nachname")}
          name="nachname"
          required
          value={child.nachname}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-1">
        <DateInput
          label={t("child.geburtsdatum")}
          name="geburtsdatum"
          required
          value={child.geburtsdatum}
          onChange={onDateChange}
        />
      </div>
      <div className="col-span-1">
        <FloatingSelect
          label={t("child.geschlecht")}
          name="geschlecht"
          options={[
            { label: t("child.geschlechtMaennlich"), value: "männlich" },
            { label: t("child.geschlechtWeiblich"), value: "weiblich" },
            { label: t("child.geschlechtDivers"), value: "divers" },
            { label: t("child.geschlechtOhneAngabe"), value: "ohne Angabe" },
          ]}
          value={child.geschlecht}
          onChange={(e) =>
            onSelectChange({
              ...e,
              target: { ...e.target, name: "geschlecht" },
            })
          }
        />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-3">
        <FloatingSelect
          label={t("child.schule")}
          name="schule"
          options={
            Array.isArray(angeboteMatrix)
              ? angeboteMatrix.map((s) => ({
                  label: s.schule,
                  value: s.schule,
                }))
              : []
          }
          value={child.schule}
          onChange={(e) =>
            onSelectChange({
              ...e,
              target: { ...e.target, name: "schule" },
            })
          }
        />
      </div>
      <div className="col-span-3">
        <FloatingSelect
          label={t("child.klasse")}
          name="klasse"
          options={(() => {
            let klassen: string[] = [];
            if (Array.isArray(angeboteMatrix)) {
              const found = angeboteMatrix.find(
                (s: any) => s.schule === child.schule
              );
              klassen = found?.klassen ?? [];
            }
            return klassen.map((k: string) => ({ label: k, value: k }));
          })()}
          value={child.klasse}
          onChange={(e) =>
            onSelectChange({
              ...e,
              target: { ...e.target, name: "klasse" },
            })
          }
        />
      </div>
    </form>
  );
};

export default ChildStep;
