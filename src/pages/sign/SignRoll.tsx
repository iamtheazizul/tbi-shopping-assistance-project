import React, { useState } from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { useLine } from '../../hooks/usePersonality';
import { signPhotos } from '../../data/signPhotos';
import { FlowHeader } from '../../components/sign/FlowHeader';

export function SignRoll() {
  const nav = useNav();
  const { selectPhoto } = useSign();
  const errorLine = useLine('error');
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-full flex-col bg-canvas">
      <FlowHeader title="Pick a photo" onClose={() => nav.setStack(['signStore'], -1)} />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <p className="text-helper font-bold text-ink-soft">Recents</p>
        {failed &&
        <p role="alert" className="mt-2 text-body text-ink">
            {errorLine}
          </p>
        }
        <ul className="mt-3 grid grid-cols-3 gap-1.5">
          {signPhotos.map((photo) =>
          <li key={photo.id}>
              <button
              type="button"
              onClick={() => {
                selectPhoto(photo.id);
                nav.push('signScan');
              }}
              aria-label={`Use photo: ${photo.alt}`}
              className="block aspect-square w-full overflow-hidden rounded-xl bg-line transition-transform duration-100 ease-out active:scale-95">
              
                <img
                src={photo.url}
                alt=""
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
                draggable={false} />
              
              </button>
            </li>
          )}
        </ul>
      </main>
    </div>);

}