(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  // Header turns solid once the page scrolls
  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) toggle.click();
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Count-up stats
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / 1600);
          el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // Filter groups (horses, events, posts)
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const items = document.querySelector(`[data-filter-items="${group.dataset.filterGroup}"]`);
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      group.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      items.querySelectorAll("[data-tags]").forEach((item) => {
        const show = f === "all" || item.dataset.tags.split(" ").includes(f);
        item.toggleAttribute("data-hidden", !show);
      });
      // Hide month headings with no visible events
      items.querySelectorAll("[data-month-label]").forEach((label) => {
        let el = label.nextElementSibling;
        let any = false;
        while (el && !el.hasAttribute("data-month-label")) {
          if (!el.hasAttribute("data-hidden")) any = true;
          el = el.nextElementSibling;
        }
        label.toggleAttribute("data-hidden", !any);
      });
    });
  });

  // Mini calendar
  const cal = document.querySelector("[data-mini-cal]");
  if (cal) {
    const events = [...document.querySelectorAll("[data-event-list] [data-date]")];
    const byDate = new Map(events.map((ev) => [ev.dataset.date, ev]));
    const first = new Date(events[0].dataset.date + "T12:00:00");
    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    const title = cal.querySelector("[data-cal-title]");
    const days = cal.querySelector("[data-cal-days]");
    const pad = (n) => String(n).padStart(2, "0");
    const today = new Date();

    const render = () => {
      title.textContent = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      days.innerHTML = "";
      for (let i = 0; i < view.getDay(); i++) days.appendChild(document.createElement("span"));
      const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= count; d++) {
        const key = `${view.getFullYear()}-${pad(view.getMonth() + 1)}-${pad(d)}`;
        const cell = document.createElement("span");
        cell.textContent = d;
        if (view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth() && d === today.getDate()) cell.classList.add("today");
        const ev = byDate.get(key);
        if (ev) {
          cell.classList.add("has-event");
          cell.tabIndex = 0;
          cell.setAttribute("role", "button");
          cell.setAttribute("aria-label", `${d}: ${ev.querySelector("h3").textContent}`);
          const go = () => {
            days.querySelectorAll(".is-selected").forEach((c) => c.classList.remove("is-selected"));
            cell.classList.add("is-selected");
            ev.scrollIntoView({ behavior: "smooth", block: "center" });
            ev.classList.add("is-flash");
            setTimeout(() => ev.classList.remove("is-flash"), 1600);
          };
          cell.addEventListener("click", go);
          cell.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
        }
        days.appendChild(cell);
      }
    };
    cal.querySelector("[data-cal-prev]").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
    cal.querySelector("[data-cal-next]").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
    render();
  }

  // Contact form (prototype: no backend yet)
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const interest = new URLSearchParams(location.search).get("interest");
    const select = form.querySelector("#f-interest");
    if (interest && select.querySelector(`option[value="${interest}"]`)) select.value = interest;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("is-sent");
    });
  }

  // Newsletter (prototype)
  document.querySelectorAll("[data-subscribe]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = f.querySelector("input");
      input.value = "Thank you — you're subscribed.";
      input.disabled = true;
      f.querySelector("button").disabled = true;
      f.classList.add("is-sent");
    });
  });

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
