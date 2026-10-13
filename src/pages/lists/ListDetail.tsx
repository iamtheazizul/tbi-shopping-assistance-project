import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, XIcon } from 'lucide-react';
import { useNav } from '../../contexts/NavigationContext';
import { useTrip } from '../../contexts/TripContext';
import { useToast } from '../../contexts/ToastContext';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { usePersonality } from '../../hooks/usePersonality';
import { quickItems } from '../../data/lists';
import { lineFor } from '../../data/copy';
import { ScreenLayout } from '../../components/ScreenLayout';
import { AddItemForm } from '../../components/AddItemForm';
import { Chip } from '../../components/ui/Chip';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { easeOut } from '../../utils/motion';
import { capitalize } from '../../utils/trip';

export function ListDetail() {
  const nav = useNav();
  const { activeList, addItem, removeItem, deleteList } = useTrip();
  const { showToast } = useToast();
  const reduce = useShouldReduceMotion();
  const personality = usePersonality();

  if (!activeList) return null;
  const list = activeList;
  const available = quickItems.filter((q) => !list.items.some((i) => i.toLowerCase() === q.toLowerCase()));

  const handleBack = () => {
    if (list.items.length === 0) deleteList(list.id);
    nav.back();
  };

  return (
    <ScreenLayout
      title={list.name}
      onBack={handleBack}
      footer={
      <PrimaryButton
        disabled={list.items.length === 0}
        onClick={() => {
          showToast(lineFor('listSaved', personality));
          nav.push('chooseStore');
        }}>
        
          Next: choose a store
        </PrimaryButton>
      }>
      
      <AddItemForm
        label="Add an item"
        placeholder="Add an item"
        onAdd={(name) => addItem(list.id, name)}
        duplicateMessage={(v) => `${capitalize(v)} is already on your list.`} />
      

      {available.length > 0 &&
      <div className="mt-5 flex flex-wrap gap-2">
          {available.map((item) =>
        <Chip key={item} label={item} icon={PlusIcon} onClick={() => addItem(list.id, item)} />
        )}
        </div>
      }

      <section aria-labelledby="list-items" className="mt-8">
        <h2 id="list-items" className="text-helper font-bold text-ink-soft">
          {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
        </h2>
        {list.items.length === 0 ?
        <p className="mt-3 text-body text-ink">Add your first item above.</p> :

        <ul className="mt-3 overflow-hidden rounded-3xl border-2 border-line bg-card">
            <AnimatePresence initial={false}>
              {list.items.map((item, i) =>
            <motion.li
              key={item}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
              className={`overflow-hidden ${i > 0 ? 'border-t-2 border-line' : ''}`}>
              
                  <div className="flex min-h-[60px] items-center justify-between gap-3 pl-5 pr-2">
                    <span className="text-body font-bold text-ink">{item}</span>
                    <button
                  type="button"
                  onClick={() => removeItem(list.id, item)}
                  aria-label={`Remove ${item}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-150 ease-out hover:bg-primary-soft">
                  
                      <XIcon aria-hidden size={22} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.li>
            )}
            </AnimatePresence>
          </ul>
        }
      </section>
    </ScreenLayout>);

}