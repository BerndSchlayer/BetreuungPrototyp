import React from "react";

import FloatingInput from "./components/FloatingInput";
import FloatingSelect from "./components/FloatingSelect";
import DateInput from "./components/DateInput";
import LookupSelect from "./components/LookupSelect";
import TagInput from "./components/TagInput";

import angeboteMatrix from "./utils/angeboteMatrix.json";

import { useState } from "react";

// Typ für ein Betreuungspaket
type AngebotState = {
  angebot: string;
  geschwister: boolean;
  geschwisterName: string;
  ausgewaehlteTage: string[];
};

function App() {
  const handleChildDateChange = (value: string | null) => {
    setChild((prev) => ({ ...prev, geburtsdatum: value ?? "" }));
  };
  // State für Kind-Seite
  const [child, setChild] = useState({
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    geschlecht: "",
    schule: "",
    klasse: "",
  });

  // Validierung für Pflichtfelder der zweiten Seite
  // Pflichtfeld-Prüfung für die Kind-Seite ist für den Prototyp-Test auskommentiert
  const allChildRequiredFilled =
    child.vorname.trim() &&
    child.nachname.trim() &&
    child.geburtsdatum.trim() &&
    child.geschlecht.trim() &&
    child.schule.trim() &&
    child.klasse.trim();

  // State für Betreuungsangebot-Seite
  const [angebote, setAngebote] = useState<AngebotState[]>([
    {
      angebot: "",
      geschwister: false,
      geschwisterName: "",
      ausgewaehlteTage: [],
    },
  ]);

  // Validierung für Betreuungsangebot-Seite
  const allAngeboteValid = angebote.every(
    (a) => a.angebot && (!a.geschwister || a.geschwisterName.trim())
  );

  // Handler für Betreuungsangebot-Felder
  const handleAngebotChange = (idx: number, field: string, value: string) => {
    setAngebote((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  // Handler für die Auswahl der Tage (Checkboxen)
  const handleTagCheckbox = (idx: number, tag: string, checked: boolean) => {
    setAngebote((prev) =>
      prev.map((a, i) => {
        if (i !== idx) return a;
        const aktuelleTage = Array.isArray(a.ausgewaehlteTage)
          ? a.ausgewaehlteTage
          : [];
        let neueTage;
        if (checked) {
          neueTage = [...aktuelleTage, tag];
        } else {
          neueTage = aktuelleTage.filter((t) => t !== tag);
        }
        return { ...a, ausgewaehlteTage: neueTage };
      })
    );
  };
  const handleGeschwisterCheckbox = (idx: number, checked: boolean) => {
    setAngebote((prev) =>
      prev.map((a, i) =>
        i === idx
          ? {
              ...a,
              geschwister: checked,
              geschwisterName: checked ? a.geschwisterName : "",
            }
          : a
      )
    );
  };
  // Dynamische maximale Anzahl Betreuungspakete je nach Schule
  const maxPakete = (() => {
    const schuleObj = Array.isArray(angeboteMatrix)
      ? angeboteMatrix.find((s) => s.schule === child.schule)
      : undefined;
    return schuleObj && Array.isArray(schuleObj.angebote)
      ? schuleObj.angebote.length
      : 1;
  })();

  const handleAddAngebot = () => {
    if (angebote.length < maxPakete)
      setAngebote([
        ...angebote,
        {
          angebot: "",
          geschwister: false,
          geschwisterName: "",
          ausgewaehlteTage: [],
        },
      ]);
  };
  const handleRemoveAngebot = (idx: number) => {
    setAngebote((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };
  const handleChildSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };
  // Validierung für Pflichtfelder der ersten Seite
  const [step, setStep] = useState(0);
  // State für Hinweise-Seite
  const [hinweise, setHinweise] = useState({
    betreuungsart: "",
    abholName: "",
    buslinie: "",
    nimmtMedikamente: false,
    medikamente: "",
    hatUnvertraeglichkeiten: false,
    unvertraeglichkeiten: "",
  });

  // Validierung für Pflichtfelder der dritten Seite
  // Anzeige des Feldes 'Name der abholenden Person' nur bei Auswahl 'Abholung'
  const isAbholRelevant = hinweise.betreuungsart === "Abholung";
  const isBusRelevant = hinweise.betreuungsart === "Bus";
  const allHinweiseRequiredFilled =
    hinweise.betreuungsart.trim() &&
    (!isAbholRelevant || hinweise.abholName.trim()) &&
    (!isBusRelevant || hinweise.buslinie.trim()) &&
    (!hinweise.nimmtMedikamente || hinweise.medikamente.trim()) &&
    (!hinweise.hatUnvertraeglichkeiten || hinweise.unvertraeglichkeiten.trim());

  const handleHinweiseSelectChange = (value: string) => {
    setHinweise((prev) => ({
      ...prev,
      betreuungsart: value,
      abholName: value === "Abholung" ? prev.abholName : "",
    }));
  };
  const handleHinweiseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setHinweise((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const [person, setPerson] = useState({
    anrede: "",
    vorname: "",
    nachname: "",
    plz: "",
    ort: "",
    strasse: "",
    telefon: "",
    email: "",
  });

  // Validierung für Pflichtfelder der ersten Seite
  const allRequiredFilled =
    person.anrede.trim() &&
    person.vorname.trim() &&
    person.nachname.trim() &&
    person.plz.trim() &&
    person.ort.trim() &&
    person.strasse.trim() &&
    person.telefon.trim() &&
    person.email.trim();

  const handlePersonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  };
  const handlePersonSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  };
  // SEPA-Seite State
  const [sepa, setSepa] = useState({
    agb: false,
    widerruf: false,
    datenschutz: false,
    kontoinhaber: "",
    iban: "",
  });

  // IBAN Fehler-Status
  const [ibanError, setIbanError] = useState("");

  // Validierung für Pflichtfelder der SEPA-Seite
  const allSepaRequiredFilled =
    sepa.agb &&
    sepa.widerruf &&
    sepa.datenschutz &&
    sepa.kontoinhaber.trim() &&
    sepa.iban.trim();

  const handleSepaCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSepa((prev) => ({ ...prev, [name]: checked }));
  };

  // IBAN Maskierung und Validierung
  const formatIban = (value: string) => {
    // Entferne alle Nicht-Buchstaben/Zahlen und wandle alles in Großbuchstaben um
    let cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    // In 4er-Gruppen formatieren
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const validateIban = (iban: string) => {
    // IBAN muss 22 Zeichen (DE) haben, nur Buchstaben/Zahlen
    const cleaned = iban.replace(/[^A-Za-z0-9]/g, "");
    if (!/^DE[0-9A-Za-z]{20}$/.test(cleaned)) {
      return "Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Zeichen).";
    }
    return "";
  };

  const handleSepaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "iban") {
      const masked = formatIban(value);
      setSepa((prev) => ({ ...prev, iban: masked }));
      setIbanError(validateIban(masked));
    } else {
      setSepa((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step-Logik für 4 Seiten
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 border border-gray-200 rounded-lg bg-white shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Betreuungsangebot buchen
      </h1>
      <div className="flex mb-4 overflow-x-auto flex-nowrap gap-2">
        {[
          "Anmeldende Person",
          "Kind",
          "Hinweise",
          "SEPA",
          "Betreuungsangebot",
        ].map((label, i) => (
          <div
            key={i}
            className={`flex flex-col items-center min-w-[48px] px-2 py-1 select-none ${
              step === i
                ? "border-b-2 border-blue-600 font-bold text-blue-600"
                : "border-b-2 border-gray-300 text-gray-500"
            }`}
          >
            <span
              className={`inline-block w-7 h-7 rounded-full text-white font-bold flex items-center justify-center mb-1 ${
                step === i ? "bg-blue-600" : "bg-gray-300"
              }`}
              title={label}
            >
              {i + 1}
            </span>
            {step === i && (
              <span className="text-xs text-center whitespace-nowrap">
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="min-h-[120px] mb-8">
        {step === 0 && (
          // ...existing code...
          <form className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Anrede: nur linke Spalte */}
            <div className="col-span-1">
              <FloatingSelect
                label="Anrede *"
                name="anrede"
                required
                options={[
                  { label: "Herr", value: "Herr" },
                  { label: "Frau", value: "Frau" },
                  { label: "Divers", value: "Divers" },
                ]}
                value={person.anrede}
                onChange={(value) =>
                  handlePersonSelectChange({
                    target: { name: "anrede", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              />
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-3">
              <FloatingInput
                label="Vorname *"
                name="vorname"
                required
                value={person.vorname}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="Nachname *"
                name="nachname"
                required
                value={person.nachname}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-1">
              <FloatingInput
                label="PLZ *"
                name="plz"
                required
                value={person.plz}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-2">
              <FloatingInput
                label="Ort *"
                name="ort"
                required
                value={person.ort}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="Straße *"
                name="strasse"
                required
                value={person.strasse}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="Telefon / Mobil *"
                name="telefon"
                required
                value={person.telefon}
                onChange={handlePersonInputChange}
              />
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="E-Mail Adresse *"
                name="email"
                type="email"
                required
                value={person.email}
                onChange={handlePersonInputChange}
              />
            </div>
          </form>
        )}
        {step === 1 && (
          // ...existing code...
          <form className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Vorname: alle 3 Spalten */}
            <div className="col-span-3">
              <FloatingInput
                label="Vorname *"
                name="vorname"
                required
                value={child.vorname}
                onChange={handleChildInputChange}
              />
            </div>
            {/* Nachname: alle 3 Spalten */}
            <div className="col-span-3">
              <FloatingInput
                label="Nachname *"
                name="nachname"
                required
                value={child.nachname}
                onChange={handleChildInputChange}
              />
            </div>
            {/* Geburtsdatum: nur 1 Spalte */}
            <div className="col-span-1">
              {/* DateInput muss importiert werden! */}
              <DateInput
                label="Geburtsdatum *"
                name="geburtsdatum"
                required
                value={child.geburtsdatum}
                onChange={handleChildDateChange}
              />
            </div>
            {/* Geschlecht: nur 1 Spalte */}
            <div className="col-span-1">
              <FloatingSelect
                label="Geschlecht *"
                name="geschlecht"
                required
                options={[
                  { label: "männlich", value: "männlich" },
                  { label: "weiblich", value: "weiblich" },
                  { label: "divers", value: "divers" },
                  { label: "ohne Angabe", value: "ohne Angabe" },
                ]}
                value={child.geschlecht}
                onChange={(value) =>
                  handleChildSelectChange({
                    target: { name: "geschlecht", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              />
            </div>
            {/* Platzhalter für die dritte Spalte in dieser Zeile */}
            <div className="col-span-1"></div>
            {/* Schule: alle 3 Spalten */}
            <div className="col-span-3">
              <FloatingSelect
                label="Schule *"
                name="schule"
                required
                options={
                  Array.isArray(angeboteMatrix)
                    ? angeboteMatrix.map((s) => ({
                        label: s.schule,
                        value: s.schule,
                      }))
                    : []
                }
                value={child.schule}
                onChange={(value) =>
                  handleChildSelectChange({
                    target: { name: "schule", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              />
            </div>
            {/* Klasse zum Betreuungsbeginn: alle 3 Spalten, dynamisch aus Matrix */}
            <div className="col-span-3">
              <FloatingSelect
                label="Klasse zum Betreuungsbeginn *"
                name="klasse"
                required
                options={(() => {
                  const schuleObj = Array.isArray(angeboteMatrix)
                    ? angeboteMatrix.find((s) => s.schule === child.schule)
                    : undefined;
                  return schuleObj && Array.isArray(schuleObj.klassen)
                    ? schuleObj.klassen.map((k: string) => ({ label: k, value: k }))
                    : [];
                })()}
                value={child.klasse}
                onChange={(value) =>
                  handleChildSelectChange({
                    target: { name: "klasse", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              />
            </div>
          </form>
        )}
        {step === 2 && (
          <form className="grid grid-cols-3 gap-x-4 gap-y-2">
            <div className="col-span-3">
              <FloatingSelect
                label="Kind verlässt die Betreuung indem es*"
                name="betreuungsart"
                required
                options={[
                  {
                    label: "selbständig nach Hause geht",
                    value: "selbständig",
                  },
                  { label: "abgeholt wird durch", value: "Abholung" },
                  { label: "mit dem Bus nach Hause fährt", value: "Bus" },
                ]}
                value={hinweise.betreuungsart}
                onChange={(value) =>
                  handleHinweiseSelectChange(value as string)
                }
              />
            </div>
            {isAbholRelevant && (
              <div className="col-span-3">
                <FloatingInput
                  label="Name der abholenden Person *"
                  name="abholName"
                  required
                  value={hinweise.abholName}
                  onChange={handleHinweiseInputChange}
                />
              </div>
            )}
            {isBusRelevant && (
              <div className="col-span-3">
                <FloatingInput
                  label="Buslinie *"
                  name="buslinie"
                  required
                  value={hinweise.buslinie}
                  onChange={handleHinweiseInputChange}
                />
              </div>
            )}
            <div className="col-span-3 flex items-center mt-2">
              <input
                type="checkbox"
                id="nimmtMedikamente"
                name="nimmtMedikamente"
                checked={hinweise.nimmtMedikamente}
                onChange={handleHinweiseInputChange}
                className="mr-2"
              />
              <label htmlFor="nimmtMedikamente" className="font-medium">
                Mein Kind nimmt Medikamente
              </label>
            </div>
            {hinweise.nimmtMedikamente && (
              <div className="col-span-3">
                <FloatingInput
                  label="Bitte Medikamente angeben *"
                  name="medikamente"
                  required
                  value={hinweise.medikamente}
                  onChange={handleHinweiseInputChange}
                />
              </div>
            )}
            <div className="col-span-3 flex items-center mt-2">
              <input
                type="checkbox"
                id="hatUnvertraeglichkeiten"
                name="hatUnvertraeglichkeiten"
                checked={hinweise.hatUnvertraeglichkeiten}
                onChange={handleHinweiseInputChange}
                className="mr-2"
              />
              <label htmlFor="hatUnvertraeglichkeiten" className="font-medium">
                Mein Kind hat folgende Unverträglichkeiten oder Allergien
              </label>
            </div>
            {hinweise.hatUnvertraeglichkeiten && (
              <div className="col-span-3">
                <FloatingInput
                  label="Bitte Unverträglichkeiten oder Allergien angeben *"
                  name="unvertraeglichkeiten"
                  required
                  value={hinweise.unvertraeglichkeiten}
                  onChange={handleHinweiseInputChange}
                />
              </div>
            )}
          </form>
        )}
        {step === 3 && (
          <form className="grid grid-cols-3 gap-x-4 gap-y-2">
            <div className="col-span-3 mb-2">
              <input
                type="checkbox"
                id="agb"
                name="agb"
                checked={sepa.agb}
                onChange={handleSepaCheckboxChange}
                className="mr-2"
                required
              />
              <label htmlFor="agb" className="font-medium">
                Ich habe die{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nutzungsbedingungen
                </a>{" "}
                gelesen*
              </label>
            </div>
            <div className="col-span-3 mb-2">
              <input
                type="checkbox"
                id="widerruf"
                name="widerruf"
                checked={sepa.widerruf}
                onChange={handleSepaCheckboxChange}
                className="mr-2"
                required
              />
              <label htmlFor="widerruf" className="font-medium">
                Ich habe die{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung der Stadt Bad Waldsee
                </a>{" "}
                gelesen*
              </label>
            </div>
            <div className="col-span-3 mb-2">
              <input
                type="checkbox"
                id="datenschutz"
                name="datenschutz"
                checked={sepa.datenschutz}
                onChange={handleSepaCheckboxChange}
                className="mr-2"
                required
              />
              <label htmlFor="sepaZustimmung" className="font-medium">
                Hiermit ermächtige ich die Stadt Bad Waldsee jederzeit
                widerruflich wiederkehrende Zahlungen bei Fälligkeit mittels
                SEPA-Basislastschrift einzuziehen{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hineweise zum SEPA-Mandat
                </a>
                *
              </label>
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="Kontoinhaber *"
                name="kontoinhaber"
                required
                value={sepa.kontoinhaber}
                onChange={handleSepaInputChange}
              />
            </div>
            <div className="col-span-3">
              <FloatingInput
                label="IBAN *"
                name="iban"
                required
                value={sepa.iban}
                onChange={handleSepaInputChange}
                maxLength={27} // DE IBAN: 22 Zeichen + 5 Leerzeichen
              />
              {ibanError && (
                <div className="text-red-600 text-sm mt-1">{ibanError}</div>
              )}
            </div>
          </form>
        )}
        {step === 4 && (
          <div>
            {angebote.map((a, idx) => {
              // Dynamische Optionen je nach gewählter Schule
              const schuleObj = Array.isArray(angeboteMatrix)
                ? angeboteMatrix.find((s) => s.schule === child.schule)
                : undefined;
              const angebotOptions =
                schuleObj && Array.isArray(schuleObj.angebote)
                  ? schuleObj.angebote.map((ag) => ({
                      label: ag.angebot,
                      value: ag.angebot,
                    }))
                  : [];
              // Finde die Zeiten für das aktuell gewählte Angebot
              const angebotObj =
                schuleObj && Array.isArray(schuleObj.angebote)
                  ? schuleObj.angebote.find((ag) => ag.angebot === a.angebot)
                  : undefined;
              const tageMitUhrzeit =
                angebotObj && Array.isArray(angebotObj.zeiten)
                  ? angebotObj.zeiten
                  : [];
              return (
                <div
                  key={idx}
                  className="mb-6 p-4 border rounded-lg bg-gray-50"
                >
                  <form className="grid grid-cols-3 gap-x-4 gap-y-2">
                    <div className="col-span-3">
                      <FloatingSelect
                        label="Betreuungsangebot *"
                        name="angebot"
                        required
                        options={angebotOptions}
                        value={a.angebot}
                        onChange={(e) => {
                          let value: string;
                          if (typeof e === "string") {
                            value = e;
                          } else if (e && e.target) {
                            value = e.target.value;
                          } else {
                            value = "";
                          }
                          handleAngebotChange(idx, "angebot", value);
                        }}
                      />
                    </div>
                    {/* Checkboxen für die Tage */}
                    {tageMitUhrzeit.length > 0 && (
                      <div className="col-span-3 mt-2">
                        <label className="block font-medium mb-1">
                          Tage auswählen:
                        </label>
                        <div className="flex flex-wrap gap-4">
                          {tageMitUhrzeit.map((z) => (
                            <label
                              key={z.tag}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={a.ausgewaehlteTage.includes(z.tag)}
                                onChange={(e) =>
                                  handleTagCheckbox(
                                    idx,
                                    z.tag,
                                    e.target.checked
                                  )
                                }
                              />
                              <span>
                                {z.tag}
                                {z.uhrzeitVon || z.uhrzeitBis ? (
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({z.uhrzeitVon}
                                    {z.uhrzeitVon && z.uhrzeitBis ? "–" : ""}
                                    {z.uhrzeitBis})
                                  </span>
                                ) : null}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Geschwisterkind-Checkbox nur anzeigen, wenn ein Angebot gewählt ist */}
                    {a.angebot && (
                      <div className="col-span-3 flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`geschwister-${idx}`}
                          name="geschwister"
                          checked={a.geschwister}
                          onChange={(e) =>
                            handleGeschwisterCheckbox(idx, e.target.checked)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`geschwister-${idx}`}
                          className="font-medium"
                        >
                          Ein Geschwisterkind besucht bereits dieses Angebot
                          bzw. wurde ebenfalls angemeldet
                        </label>
                      </div>
                    )}
                    {a.geschwister && (
                      <div className="col-span-3">
                        <FloatingInput
                          label="Name des Geschwisterkinds *"
                          name="geschwisterName"
                          required
                          value={a.geschwisterName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleAngebotChange(
                              idx,
                              "geschwisterName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                    {angebote.length > 1 && (
                      <div className="col-span-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveAngebot(idx)}
                          className="text-red-600 text-sm underline"
                        >
                          Entfernen
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              );
            })}
            {angebote.length < maxPakete && (
              <button
                type="button"
                onClick={handleAddAngebot}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Betreuungspaket hinzufügen
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Zurück
        </button>
        <button
          onClick={handleNext}
          disabled={
            step === 0
              ? !allRequiredFilled
              : step === 1
              ? !allChildRequiredFilled
              : step === 2
              ? !allHinweiseRequiredFilled
              : step === 3
              ? !allSepaRequiredFilled
              : false
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

export default App;
