export function initScrollIn() {
  const nodes = [...document.querySelectorAll("[data-scroll]")];
  if (!nodes.length) return;

  const reveal = (node) => node.classList.add("is-in");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(reveal);
    return;
  }

  document.documentElement.classList.add("has-scroll-anim");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 40) {
      reveal(node);
      return;
    }
    observer.observe(node);
  });
}
