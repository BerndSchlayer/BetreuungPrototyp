import React from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES: { code: string; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "uk", label: "Українська (Ukranisch)" },
  { code: "tr", label: "Türkçe" },
  { code: "ar", label: "العربية (Syrisch)" },
  { code: "it", label: "Italiano" },
  { code: "ru", label: "Русский (Russisch)" },
  { code: "es", label: "Español" },
  { code: "el", label: "Ελληνικά (Griechisch)" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  React.useEffect(() => {
    const stored = localStorage.getItem("app_language");
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
  }, [i18n]);

  return (
    <select
      value={current}
      onChange={handleChange}
      className="px-2 py-1 rounded border bg-white text-sm ml-2"
      aria-label="Sprache wählen"
      title="Sprache wählen"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
