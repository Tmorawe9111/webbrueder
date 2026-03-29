# Technisches SEO: Core Web Vitals & Validierung

## Gemessene Stichprobe (einmalig, März 2026)

- **URL:** öffentliche Startseite (Redirect auf `www` mit Punycode-Domain beachten).
- **Lighthouse Performance-Score (Mobile):** ca. **0,72**.
- **LCP:** ca. **4,4 s** (Verbesserungspotenzial: Hero-Bild komprimieren, Third-Party-Skripte entlasten).
- **CLS:** **0** in diesem Lauf.

Die Rohdaten liegen nicht im Repo; bei Deploy-Änderungen Messung wiederholen.

## Core Web Vitals messen

1. **Chrome Lighthouse** (lokal): DevTools → Lighthouse → Modus „Navigation“, Kategorie „Performance“.
2. **CLI** (nach Deploy, öffentliche URL):
   ```bash
   npx lighthouse https://webbrüder.de/ --only-categories=performance --view
   ```
3. **PageSpeed Insights:** [pagespeed.web.dev](https://pagespeed.web.dev/) — URL `https://webbrüder.de/` eintragen (Mobile + Desktop).

### Bereits im Code berücksichtigt

- **LCP:** Hero-Bild `assets/hero/hero-team-desks.jpg` mit `preload`, `fetchpriority="high"`, `width`/`height`, `loading="eager"` am sichtbaren Hero-`<img>`.
- **Third-Party:** GSAP, ScrollTrigger und Lenis von CDN — im `<head>` sind `preconnect` zu `cdnjs.cloudflare.com` und `unpkg.com` gesetzt, um DNS/TLS zu beschleunigen.
- **Weitere Ideen (bei schlechten Scores):** Skripte self-hosten oder bündeln; Lenis nur laden, wenn keine `prefers-reduced-motion`; Hero-JPEG neu komprimieren (aktuell im Projekt ca. **279 KB**; Ziel je nach Qualität z. B. 120–200 KB).

## Strukturierte Daten prüfen

- [Google Rich Results Test](https://search.google.com/test/rich-results) — URL oder Quellcode-Snippet.
- [Schema.org Validator](https://validator.schema.org/) — JSON-LD aus [`index.html`](../index.html) einfügen.

**Abgleich:** Adresse, Markenname (Webbrüder / Morawe Ventures GbR), Leistungen und FAQ-Texte müssen mit sichtbarem Impressum und FAQ auf der Seite übereinstimmen.

## Indexierung

- Canonical und `hreflang` stehen in `index.html`; bei neuen HTML-Seiten dieselben Patterns übernehmen und [`sitemap.xml`](../sitemap.xml) ergänzen.

## Erledigt = Phase 1 (Checkliste)

- [x] Lighthouse/PageSpeed einmal dokumentiert (siehe Abschnitt „Gemessene Stichprobe“ oben)
- [ ] Rich-Results- oder Schema-Test ohne kritische Fehler (nach jedem größeren JSON-LD-Edit wiederholen)
- [x] Hero-Bildgröße im Dateisystem geprüft (~279 KB; Kompression optional bei Bedarf)
