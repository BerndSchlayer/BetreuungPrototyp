import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";


interface TagInputProps<T = any> {
  value: any[];
  onChange: (tags: any[]) => void;
  options: T[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TagInput = forwardRef(function TagInput<T = any>(
  {
    value,
    onChange,
    options,
    getOptionLabel = (o: any) => o.label ?? o.name ?? "",
    getOptionValue = (o: any) => o.value ?? o.id ?? o.benutzer_id,
    placeholder,
    disabled = false,
    className = "",
  }: TagInputProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  const { t } = useTranslation('TagInput');
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  // Expose inputRef to parent
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter Vorschläge
  useEffect(() => {
    const f = options.filter(
      (o) =>
        !value.includes(getOptionValue(o)) &&
        getOptionLabel(o).toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(f);
    setHighlighted(f.length > 0 ? 0 : -1);
  }, [input, value, options, getOptionLabel, getOptionValue]);

  // Outside click schließt Dropdown
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
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Tastatursteuerung
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setHighlighted(filtered.length > 0 ? 0 : -1);
      return;
    }
    if (!open) {
      if (e.key === "Backspace" && input === "" && value.length > 0) {
        onChange(value.slice(0, -1));
      }
      return;
    }
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
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (highlighted >= 0 && highlighted < filtered.length) {
        e.preventDefault();
        const option = filtered[highlighted];
        onChange([...value, getOptionValue(option)]);
        setInput("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setOpen(true);
  };

  const handleRemove = (id: any) => {
    onChange(value.filter((v) => v !== id));
  };

  const handleSelect = (id: any) => {
    onChange([...value, id]);
    setInput("");
    setOpen(false);
    inputRef.current && inputRef.current.focus();
  };

  // Position Dropdown relativ zum Inputtext
  const getDropdownStyle = (): React.CSSProperties => {
    if (!inputRef.current) return {};
    return {
      position: "absolute",
      left: inputRef.current.offsetLeft,
      top: inputRef.current.offsetTop + inputRef.current.offsetHeight + 2,
      minWidth: inputRef.current.offsetWidth,
      zIndex: 1000,
    };
  };

  return (
    <div className={`border rounded px-2 py-1 flex flex-wrap items-center min-h-[42px] bg-white relative ${className}`}>
      {value.map((id) => {
        // Versuche das passende Objekt zu finden, sonst Dummy-Objekt mit ID
        const option = options.find((o) => getOptionValue(o) === id) || { [typeof id === 'string' ? 'id' : 'user_id']: id };
        return (
          <span
            key={id}
            className="bg-blue-100 text-blue-800 rounded px-2 py-1 mr-1 mb-1 flex items-center"
          >
            {getOptionLabel(option as T)}
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-red-600"
              onClick={() => handleRemove(id)}
              tabIndex={-1}
              disabled={disabled}
            >
              ×
            </button>
          </span>
        );
      })}
      <input
        ref={inputRef}
        className="flex-1 min-w-[120px] px-1 py-1 outline-none"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('placeholder')}
        disabled={disabled}
        style={{ minWidth: 120 }}
      />
      {open && filtered.length > 0 && (
        <div
          ref={dropdownRef}
          style={getDropdownStyle()}
          className="bg-white border rounded shadow max-h-40 overflow-auto"
        >
          {filtered.slice(0, 10).map((o, idx) => (
            <div
              key={getOptionValue(o)}
              className={`px-3 py-2 cursor-pointer ${highlighted === idx ? "bg-blue-100" : ""}`}
              onMouseDown={() => handleSelect(getOptionValue(o))}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {getOptionLabel(o)}
            </div>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && (
        <div
          ref={dropdownRef}
          style={getDropdownStyle()}
          className="bg-white border rounded shadow max-h-40 overflow-auto px-3 py-2 text-gray-400 text-sm"
        >
          {t('no_options')}
        </div>
      )}
    </div>
  );
});

export default TagInput;
