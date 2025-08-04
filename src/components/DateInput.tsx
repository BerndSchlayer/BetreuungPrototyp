import React, { useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import { X } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { de } from "date-fns/locale";
import type { Locale } from "date-fns"; // <--- Locale Typ importieren
import { t } from "i18next";

// Kalender-Icon SVG
function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

interface SimpleCalendarProps {
  selected?: Date | null;
  onSelect: (date: Date) => void;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  locale?: Locale;
  onClose: () => void;
  autoFocus?: boolean;
  popupStyle?: React.CSSProperties; // <-- hinzugefügt
}

// Einfacher Kalender-Popup
function SimpleCalendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  locale = de,
  onClose,
  autoFocus,
  popupStyle, // <-- hinzugefügt
}: SimpleCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState<number>(
    selected ? selected.getMonth() : today.getMonth()
  );
  const [year, setYear] = useState<number>(
    selected ? selected.getFullYear() : today.getFullYear()
  );
  const calendarRef = useRef<HTMLDivElement>(null); // <--- Typisieren
  // NEU: Props für dynamische Breite/Position
  const [popupStyleState, setPopupStyle] = useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (autoFocus && calendarRef.current) {
      calendarRef.current.focus();
    }
  }, [autoFocus]);

  function daysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
  }

  function handleDayClick(day: number) {
    const date = new Date(year, month, day);
    if ((minDate && date < minDate) || (maxDate && date > maxDate)) return;
    onSelect(date);
    onClose();
  }

  // Wochentage: Montag = 0, Sonntag = 6 (für deutsche Darstellung)
  const weekDays = [
    "Short_Monday",
    "Short_Tuesday",
    "Short_Wednesday",
    "Short_Thursday",
    "Short_Friday",
    "Short_Saturday",
    "Short_Sunday",
  ];

  // JS getDay(): Sonntag=0, Montag=1, ..., Samstag=6
  // Wir wollen: Montag=0, ..., Sonntag=6
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;
  const numDays = daysInMonth(year, month);
  // Kalender-Tage in Wochen aufteilen
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];
  // Leere Felder für die Tage vor dem 1.
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= numDays; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <div
      ref={calendarRef}
      tabIndex={0}
      className="absolute bg-white border rounded shadow-lg z-50 p-2 outline-none"
      style={popupStyle} // <-- hinzugefügt
    >
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}>
          &lt;
        </button>
        <span>{format(new Date(year, month, 1), "MMMM yyyy", { locale })}</span>
        <button onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}>
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs mb-1">
        {weekDays.map((key) => (
          <div key={key} className="font-bold text-center">
            {t(`DateInput:${key}`)}
          </div>
        ))}
      </div>
      <div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((d, di) => (
              <button
                key={di}
                className={`h-8 w-8 text-center rounded ${
                  d &&
                  selected &&
                  selected.getDate() === d &&
                  selected.getMonth() === month &&
                  selected.getFullYear() === year
                    ? "bg-blue-500 text-white"
                    : d
                    ? "hover:bg-gray-200"
                    : ""
                }`}
                disabled={!d}
                onClick={() => d && handleDayClick(d)}
              >
                {d || ""}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={onClose} className="text-sm px-2 py-1">
          {t("DateInput:Close")}
        </button>
      </div>
    </div>
  );
}

interface DateInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  clearable?: boolean;
  [key: string]: any; // Für restliche Props
}

export default function DateInput({
  value,
  onChange,
  label,
  disabled = false,
  placeholder = "",
  minDate,
  maxDate,
  required = false,
  clearable = true,
  ...rest
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(
    value ? format(parseISO(value), "dd.MM.yyyy") : ""
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [calendarAutoFocus, setCalendarAutoFocus] = useState<boolean>(false);
  // NEU: Kalender-Ref für dynamische Breite/Position
  const calendarRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!value) setInputValue("");
    else {
      try {
        const d = parseISO(value);
        if (isValid(d)) setInputValue(format(d, "dd.MM.yyyy"));
      } catch {
        setInputValue("");
      }
    }
  }, [value]);

  let dateValue: Date | null = null;
  if (inputValue) {
    const parts = inputValue.split(".");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d && m && y) {
        const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        const parsed = parseISO(iso);
        if (isValid(parsed)) dateValue = parsed;
      }
    }
  }

  // Hilfsfunktion: Eingabe nach Regeln interpretieren
  function parseSmartDateInput(str: string): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const cleaned = str.replace(/[^0-9.]/g, "");
    // 1. 8-stellig ohne Punkt: TTMMYYYY
    if (/^\d{8}$/.test(cleaned)) {
      const t = cleaned.slice(0, 2),
        m = cleaned.slice(2, 4),
        y = cleaned.slice(4);
      if (
        typeof t === "string" &&
        typeof m === "string" &&
        typeof y === "string" &&
        t.length &&
        m.length &&
        y.length
      ) {
        return `${t}.${m}.${y}`;
      }
    }
    // 2. 1-2-stellig: Tag
    if (/^\d{1,2}$/.test(cleaned)) {
      return `${cleaned.padStart(2, "0")}.${String(month).padStart(
        2,
        "0"
      )}.${year}`;
    }
    // 3. TT.MM
    if (/^\d{1,2}\.\d{1,2}$/.test(cleaned)) {
      const [t, m] = cleaned.split(".");
      if (t && m) {
        return `${t.padStart(2, "0")}.${m.padStart(2, "0")}.${year}`;
      }
    }
    // 4. 4-stellig: TTMM
    if (/^\d{4}$/.test(cleaned)) {
      const t = cleaned.slice(0, 2),
        m = cleaned.slice(2, 4);
      if (t && m) {
        return `${t}.${m}.${year}`;
      }
    }
    // 5. Bereits TT.MM.JJJJ oder leer
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(cleaned)) {
      return cleaned;
    }
    if (!cleaned) {
      return "";
    }
    return cleaned; // Fallback
  }

  // Hilfsfunktion: Wandelt TT.MM.JJJJ nach ISO (yyyy-MM-dd), gibt null bei Fehler
  function toIso(str: string): string | null {
    const parts = str.split(".");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d && m && y) {
        const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        const parsed = parseISO(iso);
        const valid = isValid(parsed);
        if (valid) return iso;
      }
    }
    return null;
  }

  // Handler für manuelle Eingabe
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function processInput(str: string) {
    const smart = parseSmartDateInput(str);
    const iso = toIso(smart);
    if (iso) {
      setInputValue(format(parseISO(iso), "dd.MM.yyyy"));
      onChange(iso);
    } else if (!smart) {
      setInputValue("");
      onChange(null);
    } else {
      setInputValue(smart); // Zeige was erkannt wurde
    }
  }

  function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
    processInput(e.target.value);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "ArrowDown" || e.key === "Down") && e.altKey) {
      // Alt + ArrowDown öffnet den Kalender
      e.preventDefault();
      if (!disabled) {
        setShowCalendar(true);
        setCalendarAutoFocus(true);
      }
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      processInput(e.currentTarget.value);
    }
  }

  function handleCalendarSelect(date: Date) {
    setInputValue(format(date, "dd.MM.yyyy"));
    onChange(format(date, "yyyy-MM-dd"));
    setShowCalendar(false);
  }

  React.useEffect(() => {
    if (!showCalendar) setCalendarAutoFocus(false);
  }, [showCalendar]);

  // NEU: Dynamische Breite/Position für Kalender
  function getCalendarStyle() {
    return {
      minWidth: "17rem",
      width: "17rem",
      left: 0,
      top: inputRef.current
        ? inputRef.current.offsetTop + inputRef.current.offsetHeight
        : "100%",
    };
  }

  return (
    <div className="relative w-full rounded h-[42px] flex items-center bg-white border border-gray-300 focus-within:border-blue-600 transition-colors duration-200">
      {/* Smartes Eingabefeld */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        className="peer flex-1 bg-transparent px-2 pt-5 pb-1 h-full pr-16 outline-none placeholder-transparent"
        autoComplete="off"
        disabled={disabled}
        placeholder=" "
        id={rest.id}
      />
      {/* Kalender-Icon mit Popup-Trigger */}
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 flex items-center cursor-pointer z-10"
        onMouseDown={(e) => {
          e.preventDefault();
          if (!disabled) setShowCalendar((s) => !s);
        }}
        tabIndex={-1}
        title="Kalender öffnen"
      >
        <CalendarIcon />
      </span>
      {showCalendar && (
        <SimpleCalendar
          selected={dateValue}
          onSelect={handleCalendarSelect}
          minDate={minDate}
          maxDate={maxDate}
          locale={de}
          onClose={() => setShowCalendar(false)}
          autoFocus={calendarAutoFocus}
          // NEU: Style dynamisch setzen
          popupStyle={getCalendarStyle()}
        />
      )}
      {/* Floating Label: Dynamisch */}
      <label
        htmlFor={rest.id}
        className={`absolute left-2 px-1 z-20 text-xs text-gray-500 pointer-events-none transition-all duration-200
          bg-white
          ${
            !inputValue
              ? "top-1/2 -translate-y-1/2"
              : "top-0 -translate-y-0 text-xs text-blue-600"
          }
          peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-600`}
        style={{ lineHeight: "1", paddingLeft: 2, paddingRight: 2 }}
      >
        {label}
      </label>
      {/* X-Button zum Löschen */}
      {clearable && value && !disabled && (
        <span
          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 z-10 flex items-center"
          onMouseDown={(e) => {
            e.preventDefault();
            setInputValue("");
            onChange(null);
          }}
          title="Löschen"
          tabIndex={-1}
        >
          <X className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
