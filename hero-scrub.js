/* KRSH hero — scroll-driven orbit.
   The hero pins while you scroll; scroll progress drives the orbit video's time,
   so the shoe turns with the page. Captions (.v2-beat) show between their
   data-from / data-to progress marks, timed to what the camera is looking at.
   Skipped under reduced motion: the hero stays a normal, unpinned section. */
(function () {
  const hero = document.querySelector('.hero-v2');
  const video = hero && hero.querySelector('.v2-video[data-scrub]');
  if (!video || !window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  const PIN_LENGTH = '+=220%';   // how much scrolling one full turn takes
  const SEEK_SMOOTHING = 0.25;   // seconds the video eases toward the scroll position
  const END_MARGIN = 0.05;       // stop just short of the last frame (some browsers show black there)
  const beats = [...hero.querySelectorAll('.v2-beat')];
  const state = { p: 0 };
  let duration = video.readyState >= 1 ? video.duration : 0;

  video.addEventListener('loadedmetadata', () => {
    duration = video.duration;
    seek(state.p);
  }, { once: true });

  function seek(p) {
    if (!duration) return;
    const t = p * (duration - END_MARGIN);
    if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
  }

  function showBeats(p) {
    beats.forEach(b => b.classList.toggle('is-on', p >= +b.dataset.from && p < +b.dataset.to));
  }

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: PIN_LENGTH,
    pin: true,
    onUpdate: self => {
      gsap.to(state, {
        p: self.progress, duration: SEEK_SMOOTHING, ease: 'power2.out', overwrite: true,
        onUpdate: () => seek(state.p)
      });
      showBeats(self.progress);
    }
  });
})();
