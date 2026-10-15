import { useState } from 'react';
import { Segmented } from '../ui/controls';
import { MODE_OPTIONS } from './shared';
import AudioHide from './AudioHide';
import AudioReveal from './AudioReveal';

export default function AudioLab() {
  const [mode, setMode] = useState('hide');
  const [test, setTest] = useState({ key: 0, audio: null });

  return (
    <div className="space-y-6">
      <Segmented label="Mode" value={mode} onChange={setMode} options={MODE_OPTIONS} />
      <div hidden={mode !== 'hide'}>
        <AudioHide
          onTestReveal={(audio) => {
            setTest((t) => ({ key: t.key + 1, audio }));
            setMode('reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
      <div hidden={mode !== 'reveal'}>
        <AudioReveal key={test.key} initial={test.audio} />
      </div>
    </div>
  );
}
