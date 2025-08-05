import React, { useRef, useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import FloatingInput from "./components/FloatingInput";
import FloatingSelect from "./components/FloatingSelect";
import DateInput from "./components/DateInput";
import LookupSelect from "./components/LookupSelect";
import TagInput from "./components/TagInput";
import LanguageSwitcher from "./components/LanguageSwitcher";

import angeboteMatrix from "./utils/angeboteMatrix.json";
import PersonStep from "./components/BookingDialogSteps/BookingDialag_PersonStep";
import ChildStep from "./components/BookingDialogSteps/BookingDialog_ChildStep";
import NotesStep from "./components/BookingDialogSteps/BookingDialog_NotesStep";
import SEPAStep, {
  formatIban,
  validateIban,
} from "./components/BookingDialogSteps/BookingDialog_SEPAStep";
import OfferStep from "./components/BookingDialogSteps/BookingDialog_OfferStep";

// Typ für ein Betreuungspaket
type AngebotState = {
  angebot: string;
  geschwister: boolean;
  geschwisterName: string;
  ausgewaehlteTage: string[];
};

function App() {
  // State für Kind-Seite
  const [child, setChild] = useState({
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    geschlecht: "",
    schule: "",
    klasse: "",
  });

  // Validierung für Pflichtfelder der Kind-Seite
  const allChildRequiredFilled =
    child.vorname.trim() &&
    child.nachname.trim() &&
    child.geburtsdatum.trim() &&
    child.geschlecht.trim() &&
    child.schule.trim() &&
    child.klasse.trim();

  const handleChildDateChange = (value: string | null) => {
    setChild((prev) => ({ ...prev, geburtsdatum: value ?? "" }));
  };

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
    (a: AngebotState) =>
      a.angebot && (!a.geschwister || a.geschwisterName.trim())
  );

  // Handler für Betreuungsangebot-Felder
  const handleAngebotChange = (idx: number, field: string, value: string) => {
    setAngebote((prev: AngebotState[]) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  // Handler für die Auswahl der Tage (Checkboxen)
  const handleTagCheckbox = (idx: number, tag: string, checked: boolean) => {
    setAngebote((prev: AngebotState[]) =>
      prev.map((a, i) => {
        if (i === idx) {
          const aktuelleTage = Array.isArray(a.ausgewaehlteTage)
            ? a.ausgewaehlteTage
            : [];
          let neueTage: string[];
          if (checked) {
            neueTage = [...aktuelleTage, tag];
          } else {
            neueTage = aktuelleTage.filter((t: string) => t !== tag);
          }
          return { ...a, ausgewaehlteTage: neueTage };
        }
        return a;
      })
    );
  };

  const handleGeschwisterCheckbox = (idx: number, checked: boolean) => {
    setAngebote((prev: AngebotState[]) =>
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

  const { t } = useTranslation();
  // Refs für die ersten Felder jeder Seite
  const refPersonVorname = useRef<HTMLInputElement>(null);
  const refChildVorname = useRef<HTMLInputElement>(null);
  const refHinweiseArt = useRef<HTMLSelectElement>(null);
  const refSepaKontoinhaber = useRef<HTMLInputElement>(null);
  const refAngebotSelect = useRef<HTMLSelectElement>(null);

  // Validierung für Pflichtfelder der ersten Seite
  const [step, setStep] = useState(0);

  const isTestMode = () => false;

  // Fokus nach Step-Wechsel setzen
  useEffect(() => {
    if (step === 0 && refPersonVorname.current) {
      refPersonVorname.current.focus();
    } else if (step === 1 && refChildVorname.current) {
      refChildVorname.current.focus();
    } else if (step === 2 && refHinweiseArt.current) {
      refHinweiseArt.current.focus();
    } else if (step === 3 && refSepaKontoinhaber.current) {
      refSepaKontoinhaber.current.focus();
    } else if (step === 4 && refAngebotSelect.current) {
      refAngebotSelect.current.focus();
    }
  }, [step]);

  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };
  const handleChildSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleHinweiseSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setHinweise((prev) => ({
      ...prev,
      betreuungsart: value,
      abholName: value === "Abholung" ? prev.abholName : "",
    }));
  };
  const handleHinweiseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, value, checked } = e.target;
    // Für Checkboxen checked verwenden, sonst value
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
  // Bankname für IBAN
  const [ibanBankName, setIbanBankName] = useState("");

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

  const handleSepaInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "iban") {
      const masked = formatIban(value);
      setSepa((prev) => ({ ...prev, iban: masked }));
      const ibanValidationMsg = validateIban(masked, t);
      setIbanError(ibanValidationMsg);

      // Nur API-Call, wenn IBAN formal gültig ist
      const cleaned = masked.replace(/[^A-Za-z0-9]/g, "");
      if (!ibanValidationMsg) {
        // Nur wenn validateIban keinen Fehler zurückgibt
        try {
          const response = await fetch(
            `https://openiban.com/validate/${cleaned}?getBank=true&validateBankCode=true&getBIC=true`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.bankData && data.bankData.name) {
              const bic = data.bankData.bic;
              setIbanBankName(
                bic ? `${data.bankData.name} (${bic})` : data.bankData.name
              );
            } else {
              setIbanBankName("Kein Bankname verfügbar");
            }
          } else {
            setIbanBankName("");
          }
        } catch (err) {
          setIbanBankName("");
        }
      } else {
        setIbanBankName("");
      }
    } else {
      setSepa((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step-Logik für 5 Seiten (statt 4)
  const handleNext = () => {
    if (step < 4) setStep(step + 1); // Schritt maximal bis 4
  };
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const [geschwister, setGeschwister] = useState(false);
  const [geschwisterName, setGeschwisterName] = useState("");

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 border border-gray-200 rounded-lg bg-white shadow relative">
      {/* Language Switcher oben rechts */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-left">{t("title")}</h1>
      <div className="flex mb-4 overflow-x-auto flex-nowrap gap-2">
        {["personTab", "childTab", "notesTab", "sepaTab", "offerTab"].map(
          (key, i) => (
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
                title={t(key)}
              >
                {i + 1}
              </span>
              {step === i && (
                <span className="text-xs text-center whitespace-nowrap">
                  {t(key)}
                </span>
              )}
            </div>
          )
        )}
      </div>
      <div className="min-h-[120px] mb-8">
        {step === 0 && (
          <PersonStep
            person={person}
            onInputChange={handlePersonInputChange}
            onSelectChange={handlePersonSelectChange}
            t={t}
          />
        )}
        {step === 1 && (
          <ChildStep
            child={child}
            angeboteMatrix={angeboteMatrix}
            onInputChange={handleChildInputChange}
            onSelectChange={handleChildSelectChange}
            onDateChange={handleChildDateChange}
            t={t}
          />
        )}{" "}
        {step === 2 && (
          <NotesStep
            hinweise={hinweise}
            isAbholRelevant={isAbholRelevant}
            isBusRelevant={isBusRelevant}
            handleHinweiseSelectChange={handleHinweiseSelectChange}
            handleHinweiseInputChange={handleHinweiseInputChange}
            t={t}
          />
        )}{" "}
        {step === 3 && (
          <SEPAStep
            sepa={sepa}
            ibanError={ibanError}
            ibanBankName={ibanBankName}
            onInputChange={handleSepaInputChange}
            onCheckboxChange={handleSepaCheckboxChange}
            t={t}
          />
        )}{" "}
        {step === 4 && (
          <OfferStep
            angeboteMatrix={angeboteMatrix}
            child={child}
            angebote={angebote}
            setAngebote={setAngebote}
            handleTagCheckbox={handleTagCheckbox}
            geschwister={geschwister}
            setGeschwister={setGeschwister}
            geschwisterName={geschwisterName}
            setGeschwisterName={setGeschwisterName}
            t={t}
          />
        )}{" "}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          {t("buttons.zurueck")}
        </button>
        <button
          onClick={handleNext}
          disabled={
            isTestMode()
              ? false
              : step === 0
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
          {step === 4 ? t("buttons.buchen") : t("buttons.weiter")}
        </button>
      </div>
    </div>
  );
}

export default App;
