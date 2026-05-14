"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './CountrySelect.module.css';
import { ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { name: "Nigeria",      flag: "🇳🇬" },
  { name: "Ethiopia",     flag: "🇪🇹" },
  { name: "Kenya",        flag: "🇰🇪" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Egypt",        flag: "🇪🇬" },
  { name: "Ghana",        flag: "🇬🇭" },
  { name: "Morocco",      flag: "🇲🇦" },
  { name: "Tanzania",     flag: "🇹🇿" },
  { name: "Uganda",       flag: "🇺🇬" },
  { name: "Algeria",      flag: "🇩🇿" },
  { name: "Others",       flag: "🌍" },
];

interface CountrySelectProps {
  id?: string;
  name?: string;
  required?: boolean;
  variant?: "dialog" | "contact";
  wrapperClassName?: string;
}

export default function CountrySelect({
  id,
  name,
  required,
  variant = "dialog",
  wrapperClassName,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const selectedCountry = COUNTRIES.find((c) => c.name === selected);

  return (
    <div
      className={[styles.wrapper, variant === "contact" ? styles.wrapperContact : "", wrapperClassName || ""].join(" ")}
      ref={ref}
    >
      <input type="hidden" id={id} name={name} value={selected} required={required} />

      <button
        type="button"
        className={[
          styles.trigger,
          variant === "contact" ? styles.triggerContact : "",
          isOpen ? styles.triggerOpen : "",
          !selected ? styles.triggerPlaceholder : "",
        ].join(" ")}
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerLeft}>
          <span className={styles.flag}>
            {selectedCountry ? selectedCountry.flag : "🌍"}
          </span>
          <span className={styles.triggerText}>
            {selectedCountry ? selectedCountry.name : "Select your country"}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={[styles.chevron, isOpen ? styles.chevronOpen : ""].join(" ")}
        />
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox" aria-label="Country">
          {COUNTRIES.map((country) => (
            <li
              key={country.name}
              className={[styles.option, selected === country.name ? styles.optionSelected : ""].join(" ")}
              role="option"
              aria-selected={selected === country.name}
              onClick={() => {
                setSelected(country.name);
                setIsOpen(false);
              }}
            >
              <span className={styles.flag}>{country.flag}</span>
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
