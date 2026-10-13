import React, { useState } from 'react';

interface AddItemFormProps {
  label: string;
  placeholder: string;
  onAdd: (value: string) => boolean;
  duplicateMessage: (value: string) => string;
}

export function AddItemForm({ label, placeholder, onAdd, duplicateMessage }: AddItemFormProps) {
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const inputId = `add-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (onAdd(draft)) {
      setDraft('');
      setNote(null);
    } else {
      setNote(duplicateMessage(draft.trim()));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setNote(null);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-line bg-card px-4 text-body font-bold text-ink placeholder:font-medium placeholder:text-ink-soft focus:border-primary-edge focus:outline-none" />
        
        <button
          type="submit"
          className="h-14 shrink-0 rounded-2xl border-2 border-line bg-card px-5 text-body font-extrabold text-ink shadow-[0_4px_0_rgb(var(--c-line))] transition-[transform,box-shadow,background-color] duration-100 ease-out hover:bg-primary-soft active:translate-y-[4px] active:shadow-none">
          
          Add
        </button>
      </div>
      {note &&
      <p role="status" className="mt-3 text-body text-ink">
          {note}
        </p>
      }
    </form>);

}