import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';

interface EditableChipListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function EditableChipList({ label, items, onChange }: EditableChipListProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (index: number, value: string) => {
    setEditing(index);
    setDraft(value);
  };

  const commit = () => {
    if (editing === null) return;
    const clean = draft.trim();
    const isDuplicate = items.some((item, i) => i !== editing && item.toLowerCase() === clean.toLowerCase());
    const next = [...items];
    if (!clean || isDuplicate) next.splice(editing, 1);else
    next[editing] = clean.charAt(0).toUpperCase() + clean.slice(1);
    onChange(next);
    setEditing(null);
  };

  const cancel = () => {
    if (editing !== null && !items[editing]) onChange(items.filter((_, i) => i !== editing));
    setEditing(null);
  };

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item, i) =>
      editing === i ?
      <li key={`edit-${i}`}>
            <input
          autoFocus
          aria-label={item ? `Rename ${item}` : `New ${label.toLowerCase()}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') cancel();
          }}
          className="h-12 w-44 rounded-full border-2 border-primary-edge bg-card px-4 text-body font-bold text-ink focus:outline-none" />
        
          </li> :

      <li key={`${item}-${i}`} className="inline-flex h-12 items-center rounded-full border-2 border-line bg-card pr-1">
            <button
          type="button"
          onClick={() => startEdit(i, item)}
          aria-label={`Rename ${item}`}
          className="h-full rounded-l-full pl-4 pr-1 text-body font-bold text-ink">
          
              {item}
            </button>
            <button
          type="button"
          onClick={() => onChange(items.filter((_, j) => j !== i))}
          aria-label={`Remove ${item}`}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-primary-soft">
          
              <XIcon aria-hidden size={18} strokeWidth={2.75} />
            </button>
          </li>

      )}
      {editing === null &&
      <li>
          <button
          type="button"
          onClick={() => {
            onChange([...items, '']);
            startEdit(items.length, '');
          }}
          className="inline-flex h-12 items-center gap-1.5 rounded-full border-2 border-dashed border-primary-edge px-4 text-body font-extrabold text-ink transition-colors duration-150 ease-out hover:bg-primary-soft">
          
            <PlusIcon aria-hidden size={18} strokeWidth={3} />
            Add
          </button>
        </li>
      }
    </ul>);

}