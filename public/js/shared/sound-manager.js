export const createSoundManager = () => {
    const sounds = new Map();
    const transitionStates = new Map();
    let enabled = true;
    let suppressEventSounds = false;

    const registerSound = (id, src, options = {}) => {
        const { volume = 1, preload = 'auto' } = options;
        const audio = new Audio(src);
        audio.preload = preload;
        audio.volume = volume;
        sounds.set(id, audio);
        return audio;
    };

    const play = (id, options = {}) => {
        if (!enabled) return;
        const sound = sounds.get(id);
        if (!sound) return;

        const { restart = true } = options;
        if (restart) {
            sound.currentTime = 0;
        }

        sound.play().catch(() => {
            // Certains navigateurs bloquent la lecture audio sans interaction utilisateur.
        });
    };

    const setEnabled = (value) => {
        enabled = Boolean(value);
    };

    const setSuppressEventSounds = (value) => {
        suppressEventSounds = Boolean(value);
    };

    const playEventTransition = (eventId, isActive, options = {}) => {
        const wasActive = transitionStates.get(eventId) || false;
        const nowActive = Boolean(isActive);
        const { soundId } = options;

        if (!suppressEventSounds && !wasActive && nowActive && soundId) {
            play(soundId);
        }

        transitionStates.set(eventId, nowActive);
    };

    return {
        registerSound,
        play,
        setEnabled,
        setSuppressEventSounds,
        playEventTransition
    };
};
