import { InputHTMLAttributes, useEffect, useRef, useState } from "react";

type CommitInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur" | "onKeyDown"
> & {
  value: string;
  onCommit: (value: string) => void;
};

/** Text input that commits on Enter or blur, and reverts on Escape. */
export const CommitInput = ({ value, onCommit, ...rest }: CommitInputProps) => {
  const [draft, setDraft] = useState(value);
  const skipCommit = useRef(false);

  useEffect(() => setDraft(value), [value]);

  return (
    <input
      type="text"
      maxLength={60}
      {...rest}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        } else if (event.key === "Escape") {
          skipCommit.current = true;
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
      onBlur={() => {
        if (skipCommit.current) {
          skipCommit.current = false;
          return;
        }
        const trimmed = draft.trim();
        if (trimmed !== value) {
          onCommit(trimmed);
        }
      }}
    />
  );
};
