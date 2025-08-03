import React, { useState, useRef, useEffect, RefObject } from "react";
import { useTranslation } from "react-i18next";

interface LookupSelectProps<T> {
  options: T[];
  value: any;
  onChange: (value: any) => void;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 20 20">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function LookupSelect<T>({
  options,
  value,
  onChange,
  getOptionLabel = (o: any) => o.label ?? o.name ?? "",
  getOptionValue = (o: any) => o.value ?? o.id ?? o.organisation_id,
  placeholder,
  disabled = false,
  className = "",
  ...props
}: LookupSelectProps<T>) {
  const { t } = useTranslation('LookupSelect');
  const [inputValue, setInputValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((o) => getOptionValue(o) === value);
    setInputValue(selected ? getOptionLabel(selected) : "");
  }, [value, options, getOptionLabel, getOptionValue]);

  const filtered = options.filter((o) =>
    getOptionLabel(o).toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    setHighlighted(filtered.length > 0 ? 0 : -1);
  }, [inputValue, open, filtered.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setHighlighted(filtered.length > 0 ? 0 : -1);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) =>
        h < filtered.length - 1 ? h + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) =>
        h > 0 ? h - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < filtered.length) {
        e.preventDefault();
        const option = filtered[highlighted];
        onChange(getOptionValue(option));
        setInputValue(getOptionLabel(option));
        setOpen(false);
      }
    } else if (e.key === "Tab") {
      if (open && highlighted >= 0 && highlighted < filtered.length) {
        const option = filtered[highlighted];
        onChange(getOptionValue(option));
        setInputValue(getOptionLabel(option));
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    setInputValue("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full border rounded px-2 py-2 bg-white focus:outline-none focus:border-blue-500 pr-16"
          placeholder={placeholder || t('placeholder')}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            setOpen(true);
          }}
          onFocus={() => {/* Entferne automatisches Öffnen beim Fokus */}}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <span
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
                setInputValue("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              title={t('clear')}
              tabIndex={-1}
            >
              <XIcon />
            </span>
          )}
          <span
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(v => !v);
              inputRef.current?.focus();
            }}
            title={open ? t('close') : t('open')}
            tabIndex={-1}
          >
            <ChevronDownIcon />
          </span>
        </div>
      </div>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-gray-400 text-sm">{t('no_results')}</div>
          ) : (
            filtered.map((option, idx) => (
              <div
                key={getOptionValue(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                  getOptionValue(option) === value ? "bg-blue-50 font-semibold" : ""
                } ${highlighted === idx ? "bg-blue-100" : ""}`}
                onMouseDown={() => {
                  onChange(getOptionValue(option));
                  setInputValue(getOptionLabel(option));
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlighted(idx)}
              >
                {getOptionLabel(option)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
