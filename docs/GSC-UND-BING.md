# Google Search Console & Bing Webmaster Tools

Schritte für **webbrüder.de** (nach DNS/Hosting live).

## Google Search Console

1. Öffnen: [search.google.com/search-console](https://search.google.com/search-console)
2. **Property hinzufügen** → URL-Präfix: `https://webbrüder.de/` (oder Domain-Property, falls gewünscht)
3. **Verifizierung** (eine Methode reicht):
   - **HTML-Tag:** Meta-Tag in [`index.html`](../index.html) im `<head>` einfügen (Zeile nach den anderen Meta-Tags, siehe Kommentar `google-site-verification` in der Datei).
   - Alternativ: DNS-TXT bei IONOS/Vercel
4. Nach Verifizierung: **Sitemaps** → `https://webbrüder.de/sitemap.xml` einreichen ([`sitemap.xml`](../sitemap.xml))
5. **URL-Prüfung** für `/`, `/impressum.html`, `/datenschutz.html` und neue Landingpages

## Bing Webmaster Tools

1. [www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Site hinzufügen → ggf. Import aus Google Search Console (schnellste Variante)
3. Sitemap: `https://webbrüder.de/sitemap.xml`
4. Optional: Meta-Tag `msvalidate.01` wie in Kommentar in `index.html` beschrieben

## Hinweis IDN (ü im Domainnamen)

Browser zeigen `webbrüder.de`, technisch kann die Punycode-Domain `xn--webbrder-95a.de` heißen. In GSC/Bing die Property-URL verwenden, die ihr in der Search Console auswählt (meist die kanonische `https://webbrüder.de/`).

## Erledigt = Phase 0 (Ops)

- [ ] GSC Property verifiziert  
- [ ] Sitemap eingereicht  
- [ ] Bing verbunden  
- [ ] Keine kritischen Coverage-Fehler (nach 48–72 h prüfen)
