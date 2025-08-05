import React, { useRef, useEffect } from "react";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

type PersonStepProps = {
  person: {
    anrede: string;
    vorname: string;
    nachname: string;
    plz: string;
    ort: string;
    strasse: string;
    telefon: string;
    email: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  t: (key: string) => string;
};

const PersonStep: React.FC<PersonStepProps> = ({
  person,
  onInputChange,
  onSelectChange,
  t,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className="grid grid-cols-3 gap-x-4 gap-y-2">
      <div className="col-span-1">
        <FloatingSelect
          label={t("person.anrede")}
          name="anrede"
          options={[
            { label: t("person.salutationHerr"), value: "Herr" },
            { label: t("person.salutationFrau"), value: "Frau" },
            { label: t("person.salutationDivers"), value: "Divers" },
          ]}
          value={person.anrede}
          onChange={(e) =>
            onSelectChange({
              ...e,
              target: { ...e.target, name: "anrede" },
            })
          }
        />
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-3">
        <FloatingInput
          label={t("person.vorname")}
          name="vorname"
          required
          value={person.vorname}
          onChange={onInputChange}
          ref={inputRef}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("person.nachname")}
          name="nachname"
          required
          value={person.nachname}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-1">
        <FloatingInput
          label={t("person.plz")}
          name="plz"
          required
          value={person.plz}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-2">
        <FloatingInput
          label={t("person.ort")}
          name="ort"
          required
          value={person.ort}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("person.strasse")}
          name="strasse"
          required
          value={person.strasse}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("person.telefon")}
          name="telefon"
          required
          value={person.telefon}
          onChange={onInputChange}
        />
      </div>
      <div className="col-span-3">
        <FloatingInput
          label={t("person.email")}
          name="email"
          required
          value={person.email}
          onChange={onInputChange}
        />
      </div>
    </form>
  );
};

export default PersonStep;
