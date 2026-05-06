import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSoundManager } from '../../public/js/shared/sound-manager.js';

class MockAudio {
  constructor(src) {
    this.src = src;
    this.preload = '';
    this.volume = 1;
    this.currentTime = 0;
  }
  play() {
    return Promise.resolve();
  }
}

describe('sound-manager', () => {
  let sm;
  let audio;

  beforeEach(() => {
    globalThis.Audio = MockAudio;
    sm = createSoundManager();
    audio = sm.registerSound('click', '/audio/click.mp3', { volume: 0.5, preload: 'auto' });
  });

  it('enregistre un son avec les options données', () => {
    expect(audio).toBeInstanceOf(MockAudio);
    expect(audio.src).toBe('/audio/click.mp3');
    expect(audio.volume).toBe(0.5);
    expect(audio.preload).toBe('auto');
  });

  it('joue un son enregistré (avec restart par défaut)', async () => {
    const spy = vi.spyOn(audio, 'play');
    audio.currentTime = 1.234;

    sm.play('click');

    // play est appelé et currentTime remis à 0
    expect(audio.currentTime).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);

    // Nettoyage pour éviter les warnings de promesse non attendue
    await Promise.resolve();
  });

  it("ne réinitialise pas le temps si restart=false", async () => {
    const spy = vi.spyOn(audio, 'play');
    audio.currentTime = 2.5;

    sm.play('click', { restart: false });

    expect(audio.currentTime).toBe(2.5);
    expect(spy).toHaveBeenCalledTimes(1);
    await Promise.resolve();
  });

  it('ne joue rien si le gestionnaire est désactivé', async () => {
    const spy = vi.spyOn(audio, 'play');

    sm.setEnabled(false);
    sm.play('click');

    expect(spy).not.toHaveBeenCalled();
    await Promise.resolve();
  });

  it("ignore l'id inconnu sans planter", () => {
    expect(() => sm.play('unknown')).not.toThrow();
  });

  describe('playEventTransition', () => {
    it('déclenche le son lors du passage inactif -> actif', async () => {
      const spy = vi.spyOn(audio, 'play');

      sm.playEventTransition('evt1', false, { soundId: 'click' });
      expect(spy).not.toHaveBeenCalled();

      sm.playEventTransition('evt1', true, { soundId: 'click' });
      expect(spy).toHaveBeenCalledTimes(1);

      // Restant actif, ne rejoue pas
      sm.playEventTransition('evt1', true, { soundId: 'click' });
      expect(spy).toHaveBeenCalledTimes(1);

      // Passage actif -> inactif puis de nouveau actif => rejoue
      sm.playEventTransition('evt1', false, { soundId: 'click' });
      sm.playEventTransition('evt1', true, { soundId: 'click' });
      expect(spy).toHaveBeenCalledTimes(2);

      await Promise.resolve();
    });

    it('respecte suppressEventSounds', async () => {
      const spy = vi.spyOn(audio, 'play');

      sm.setSuppressEventSounds(true);
      sm.playEventTransition('evt2', true, { soundId: 'click' });

      expect(spy).not.toHaveBeenCalled();
      await Promise.resolve();
    });
  });
});
