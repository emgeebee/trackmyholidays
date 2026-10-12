import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

type EditableStatProps = {
  label: string;
  value: number;
  inputLabel: string;
  initialInputValue: number;
  onSave: (value: string) => void;
  renderHint?: (draft: number) => ReactNode;
};

const isValid = (draft: string) => /^\d+$/.test(draft);

export const EditableStat = ({
  label,
  value,
  inputLabel,
  initialInputValue,
  onSave,
  renderHint,
}: EditableStatProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(initialInputValue));
  const containerRef = useRef<HTMLSpanElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const toggle = () => {
    setDraft(String(initialInputValue));
    setOpen((wasOpen) => !wasOpen);
  };

  const save = () => {
    if (!isValid(draft)) return;
    onSave(draft);
    setOpen(false);
  };

  return (
    <span className="stat-editable" ref={containerRef}>
      <button
        type="button"
        className="stat stat--button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={`Edit ${label.toLowerCase()}`}
      >
        <span className="stat-label">
          {label}
          <FaPencilAlt className="stat-edit-icon" aria-hidden="true" />
        </span>
        <span className="stat-value">{value}</span>
      </button>
      {open && (
        <form
          className="stat-popover"
          role="dialog"
          aria-label={`Edit ${label.toLowerCase()}`}
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
          onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
        >
          <label className="stat-popover__label" htmlFor={inputId}>
            {inputLabel}
          </label>
          <input
            id={inputId}
            className="stat-popover__input"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
          />
          {renderHint && isValid(draft) && (
            <p className="stat-popover__hint">{renderHint(Number(draft))}</p>
          )}
          <div className="stat-popover__actions">
            <button
              type="button"
              className="stat-popover__btn"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="stat-popover__btn stat-popover__btn--primary"
              disabled={!isValid(draft)}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </span>
  );
};
