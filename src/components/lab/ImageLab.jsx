import { useState } from 'react';
import { Segmented } from '../ui/controls';
import { MODE_OPTIONS } from './shared';
import ImageHide from './ImageHide';
import ImageReveal from './ImageReveal';

export default function ImageLab() {
  const [mode, setMode] = useState('hide');
  const [test, setTest] = useState({ key: 0, image: null });

  return (
    <div className="space-y-6">
      <Segmented label="Mode" value={mode} onChange={setMode} options={MODE_OPTIONS} />
      <div hidden={mode !== 'hide'}>
        <ImageHide
          onTestReveal={(image) => {
            setTest((t) => ({ key: t.key + 1, image }));
            setMode('reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
      <div hidden={mode !== 'reveal'}>
        <ImageReveal key={test.key} initial={test.image} />
      </div>
    </div>
  );
}
