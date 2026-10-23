import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled, subscribeSound, playSound } from '../../utils/interactionSounds';

export default function SoundToggle() {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, () => true);
  return <button type="button" className="sound-toggle" data-sound="off"
    aria-label={enabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'}
    aria-pressed={enabled} title={enabled ? 'Âm thanh đang bật · Bấm để tắt' : 'Âm thanh đang tắt · Bấm để bật'}
    onClick={() => { setSoundEnabled(!enabled); if (!enabled) void playSound('select'); }}>
    {enabled ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
  </button>;
}
