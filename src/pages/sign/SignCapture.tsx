import React from "react";
import { CameraIcon, ImagesIcon, BoxIcon } from "lucide-react";
import { useNav } from "../../contexts/NavigationContext";
import { useLine } from "../../hooks/usePersonality";
import { ScreenLayout } from "../../components/ScreenLayout";
import { PipSays } from "../../components/PipSays";
import { Card } from "../../components/ui/Card";
export function SignCapture() {
  const nav = useNav();
  const ask = useLine('captureAsk');
  return <ScreenLayout title="Add a photo" onBack={nav.back}>
      <PipSays mood="excited">{ask}</PipSays>
      <div className="mt-6 flex flex-col gap-4">
        <CaptureOption icon={CameraIcon} label="Take a photo" description="Use your camera" onClick={() => nav.push('signCamera')} />
        <CaptureOption icon={ImagesIcon} label="Choose from photos" description="Pick one you already took" onClick={() => nav.push('signRoll')} />
      </div>
    </ScreenLayout>;
}
interface CaptureOptionProps {
  icon: BoxIcon;
  label: string;
  description: string;
  onClick: () => void;
}
function CaptureOption({
  icon: Icon,
  label,
  description,
  onClick
}: CaptureOptionProps) {
  return <Card onClick={onClick} className="flex min-h-[96px] items-center gap-4 p-5">
      <span aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft">
        <Icon size={28} strokeWidth={2.25} className="text-ink" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lead font-semibold text-ink">{label}</span>
        <span className="block text-helper text-ink-soft">{description}</span>
      </span>
    </Card>;
}