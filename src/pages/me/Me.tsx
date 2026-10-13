import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { useNav } from '../../contexts/NavigationContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ScreenLayout } from '../../components/ScreenLayout';
import { ThemeSwatches } from '../../components/ThemeSwatches';
import { RadioList } from '../../components/ui/RadioList';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { Card } from '../../components/ui/Card';

export function Me() {
  const nav = useNav();
  const { settings, updateSettings } = useSettings();

  return (
    <ScreenLayout title="Me">
      <section aria-labelledby="look-feel">
        <h2 id="look-feel" className="font-display text-lead font-semibold text-ink">
          Look and feel
        </h2>

        <p className="mt-5 text-body font-extrabold text-ink">Theme color</p>
        <div className="mt-3">
          <ThemeSwatches value={settings.theme} onChange={(theme) => updateSettings({ theme })} />
        </div>

        <p className="mt-6 text-body font-extrabold text-ink">Appearance</p>
        <div className="mt-3">
          <RadioList
            label="Appearance"
            value={settings.appearance}
            onChange={(appearance) => updateSettings({ appearance })}
            options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'Match my phone' }]
            } />
          
        </div>

        <p className="mt-6 text-body font-extrabold text-ink">Text size</p>
        <div className="mt-3">
          <RadioList
            label="Text size"
            value={settings.textSize}
            onChange={(textSize) => updateSettings({ textSize })}
            options={[
            { value: 'large', label: 'Large' },
            { value: 'xlarge', label: 'Extra large' }]
            } />
          
        </div>

        <p className="mt-6 text-body font-extrabold text-ink">Pip's personality</p>
        <p className="text-helper text-ink-soft">How much Pip jokes around. Directions always stay plain.</p>
        <div className="mt-3">
          <RadioList
            label="Pip's personality"
            value={settings.personality}
            onChange={(personality) => updateSettings({ personality })}
            options={[
            { value: 'calm', label: 'Calm' },
            { value: 'cheerful', label: 'Cheerful' },
            { value: 'goofy', label: 'Goofy' }]
            } />
          
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-line bg-card [&>*+*]:border-t-2 [&>*+*]:border-line">
          <ToggleRow
            label="Sounds"
            description="A soft pop on Got it, a little jingle at the end."
            checked={settings.sounds}
            onChange={(sounds) => updateSettings({ sounds })} />
          
          <ToggleRow
            label="Show Pip tips"
            description="Pip appears next to helpful tips."
            checked={settings.pipTips}
            onChange={(pipTips) => updateSettings({ pipTips })} />
          
          <ToggleRow
            label="Reduce motion"
            description="Simple fades instead of slides."
            checked={settings.reduceMotion}
            onChange={(reduceMotion) => updateSettings({ reduceMotion })} />
          
        </div>
      </section>

      <section aria-labelledby="directions" className="mt-10">
        <h2 id="directions" className="font-display text-lead font-semibold text-ink">
          Directions
        </h2>
        <div className="mt-3">
          <RadioList
            label="Directions"
            value={settings.directions}
            onChange={(directions) => updateSettings({ directions })}
            options={[
            { value: 'list', label: 'Simple list' },
            { value: 'map', label: 'Store map' }]
            } />
          
        </div>
        <div className="mt-4 overflow-hidden rounded-3xl border-2 border-line bg-card">
          <ToggleRow
            label="Ask about stock after trips"
            description="A quick, optional question at the end."
            checked={settings.askStock}
            onChange={(askStock) => updateSettings({ askStock })} />
          
        </div>
      </section>

      <Card onClick={() => nav.push('about')} className="mt-10 flex min-h-[64px] items-center justify-between px-5">
        <span className="text-body font-extrabold text-ink">About Pip</span>
        <ChevronRightIcon aria-hidden size={24} strokeWidth={2.5} className="text-ink" />
      </Card>
    </ScreenLayout>);

}