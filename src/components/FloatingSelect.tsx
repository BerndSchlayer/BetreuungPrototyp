import React, { forwardRef, useState, useRef, useEffect } from "react";

export interface FloatingSelectOption {
  value: string;
  label: string;
}

export interface FloatingSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options?: FloatingSelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  containerClassName?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  clearable?: boolean; // Optional: X-Button anzeigen
}

const FloatingSelect = React.forwardRef<HTMLSelectElement, FloatingSelectProps>(({
  label,
  options,
  value,
  onChange,
  containerClassName = "mb-4 relative",
  inputClassName = "peer w-full border rounded px-2 pt-5 pb-1 bg-white focus:outline-none focus:border-blue-500 h-[42px] pr-12",
  id,
  name,
  disabled,
  children,
  clearable,
  ...rest
}, ref) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optionen aus children extrahieren, falls options nicht gesetzt ist
  let opts: FloatingSelectOption[] = [];
  if (options && options.length > 0) {
    opts = options;
  } else if (children) {
    opts = React.Children.toArray(children)
      .filter(child => React.isValidElement(child) && child.type === "option")
      .map(child => {
        const el = child as React.ReactElement<{ value: string, children?: React.ReactNode }>;
        return {
          value: el.props.value,
          label: typeof el.props.children === "string" ? el.props.children : (el.props.children ? String(el.props.children) : el.props.value)
        };
      });
  }

  // Zeige immer das Label des ausgewählten Wertes (nicht den Value)
  let selectedLabel = "";
  if (opts.length > 0) {
    const selected = opts.find(opt => opt.value === value);
    selectedLabel = selected ? selected.label : "";
  } else if (children) {
    // Falls children verwendet werden (option-Tags), suche das passende Label
    React.Children.forEach(children, child => {
      if (
        React.isValidElement(child) &&
        child.props &&
        typeof child.props === "object" &&
        "value" in child.props &&
        child.props.value === value
      ) {
        selectedLabel = React.Children.toArray((child.props as { children?: React.ReactNode }).children).join('');
      }
    });
  } else {
    selectedLabel = value;
  }

  // Handler für Wertänderung
  const handleSelect = (val: string) => {
    if (typeof onChange === "function") {
      onChange(val);
    }
    setHighlighted(-1); // Highlight zurücksetzen nach Auswahl
  };

  // ChevronDownIcon wie in LookupSelect
  function ChevronDownIcon({ className = "w-4 h-4 text-gray-400" }) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 20 20">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
      </svg>
    );
  }

  // Tastatursteuerung wie LookupSelect
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      // Bei Alt+Pfeil nur öffnen, aber keinen Highlight setzen
      if (!e.altKey) {
        const idx = opts.findIndex(opt => opt.value === value);
        setHighlighted(idx >= 0 ? idx : 0);
      } else {
        setHighlighted(-1);
      }
      e.preventDefault();
      return;
    }
    if (!open) return;

    // Auswahl nur wenn Alt NICHT gedrückt ist
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !e.altKey) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted(h => {
          const newIdx = h < opts.length - 1 ? h + 1 : 0;
          return newIdx;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted(h => {
          const newIdx = h > 0 ? h - 1 : opts.length - 1;
          return newIdx;
        });
      }
    } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && e.altKey) {
      // Mit Alt keine Auswahl, nur öffnen
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < opts.length && opts[highlighted]) {
        e.preventDefault();
        handleSelect(opts[highlighted].value);
        setOpen(false);
        setHighlighted(-1); // Highlight zurücksetzen nach Auswahl
      }
    } else if (e.key === "Tab") {
      if (open && highlighted >= 0 && highlighted < opts.length && opts[highlighted]) {
        handleSelect(opts[highlighted].value);
        setOpen(false);
        setHighlighted(-1); // Highlight zurücksetzen nach Auswahl
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1); // Highlight zurücksetzen beim Schließen
    }
  };

  // Highlight nur beim Öffnen initial setzen
  useEffect(() => {
    if (open) {
      const idx = opts.findIndex(opt => opt.value === value);
      setHighlighted(idx >= 0 ? idx : 0);
    }
    // Entferne das else!
    // Highlight nicht bei value/opts-Änderung zurücksetzen
    // Das Zurücksetzen passiert beim Schließen im Event-Handler
  }, [open]); // Nur auf open reagieren

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Ref für die Dropdown-Optionen
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (
      open &&
      highlighted >= 0 &&
      optionRefs.current &&
      optionRefs.current[highlighted] instanceof HTMLElement
    ) {
      optionRefs.current[highlighted].scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  
  return (
    <div className={containerClassName}>
      <div style={{ position: "relative" }}>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          name={name}
          className={inputClassName.replace("flex-1", "") + " cursor-pointer"}
          value={selectedLabel}
          readOnly // wieder hinzugefügt
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          onKeyDown={handleInputKeyDown}
          placeholder=" "
          autoComplete="off"
          tabIndex={0}
          {...rest}
        />
        <label
          htmlFor={id}
          className={
            "absolute left-2 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-focus:text-blue-600 peer-focus:top-0 peer-focus:text-xs " +
            (value ? "top-0 text-xs" : "top-5 text-xs")
          }
        >
          {label}
        </label>
        {/* X-Button zum Löschen, wie in LookupSelect */}
        {clearable && value && !disabled && (
          <span
            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 z-20"
            onMouseDown={e => {
              e.preventDefault();
              if (typeof onChange === "function") onChange("");
              setOpen(false);
              setHighlighted(-1);
            }}
            title="Auswahl löschen"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        )}
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <ChevronDownIcon />
        </span>
        {open && (
          <div
            className="absolute left-0 bg-white border rounded shadow-lg z-50 max-h-48 overflow-y-auto"
            style={{
              width: inputRef.current ? inputRef.current.offsetWidth : undefined,
              top: inputRef.current ? inputRef.current.offsetTop + inputRef.current.offsetHeight : '100%',
              marginTop: 0,
            }}
          >
            {opts.length > 0
              ? opts.map((opt, idx) => (
                  <div
                    ref={el => { optionRefs.current[idx] = el; }}
                    key={opt.value}
                    data-highlighted={highlighted === idx ? "true" : "false"}
                    className={
                      `px-3 py-2 cursor-pointer hover:bg-blue-50` +
                      (opt.value === value ? " bg-blue-100" : "")
                    }
                    style={highlighted === idx ? { backgroundColor: "rgb(191, 219, 254)" } : undefined}
                    onMouseDown={e => {
                      e.preventDefault();
                      handleSelect(opt.value);
                      setOpen(false);
                      setHighlighted(-1); // Highlight zurücksetzen nach Auswahl
                    }}
                    onMouseEnter={() => setHighlighted(idx)}
                  >
                    {opt.label}
                  </div>
                ))
              : React.Children.map(children, (child, idx) => {
                  if (
                    React.isValidElement(child) &&
                    child.props &&
                    typeof child.props === "object" &&
                    "value" in child.props
                  ) {
                    return (
                      <div
                        ref={el => { optionRefs.current[idx] = el; }}
                        key={String(child.props.value)}
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${child.props.value === value ? "bg-blue-100" : ""} ${highlighted === idx ? "bg-blue-200" : ""}`}
                        onMouseDown={e => {
                          e.preventDefault();
                          handleSelect((child.props as { value: string }).value);
                          setOpen(false);
                          setHighlighted(-1); // Highlight zurücksetzen nach Auswahl
                        }}
                        onMouseEnter={() => setHighlighted(idx)}
                      >
                        {(child.props as { children?: React.ReactNode }).children}
                      </div>
                    );
                  }
                  return null;
                })}
          </div>
        )}
      </div>
    </div>
  );
});

export default FloatingSelect;

