# GEO — festes Prompt-Set & monatliches Testprotokoll

**Ziel:** Qualitativ prüfen, ob **Webbrüder** in KI-Antworten genannt oder zitiert wird — ohne „KI-Ranking“-Versprechen. Dokumentation z. B. in Notion, Sheet oder Tickets.

## Feste Prompts (monatlich gleich abfragen)

| # | Prompt (Deutsch) |
|---|------------------|
| 1 | Webdesign Agentur Restaurant Frankfurt |
| 2 | Webseite erstellen lassen Handwerk Deutschland |
| 3 | Website für Arztpraxis erstellen lassen SEO |
| 4 | Webentwicklung Frankfurt kleine Unternehmen |
| 5 | GEO Optimierung Website KI-Suche |

Optional erweitern: „Restaurant Website Kronberg“, „individuelle Website ohne Baukasten“.

## Protokoll pro Lauf (Vorlage)

| Feld | Inhalt |
|------|--------|
| Datum | JJJJ-MM-TT |
| Tool | z. B. ChatGPT, Perplexity, Gemini, Copilot |
| Prompt # | 1–5 |
| Antwortausschnitt | 2–4 Sätze (Webbrüder genannt? ja/nein; wie?) |
| Konkurrenz | Welche anderen Anbieter/Seiten genannt? |
| Auffälligkeiten | Falsche Fakten? veraltete Infos? |

## Maßnahmen bei schwachen Ergebnissen

- Sichtbare **Fakten** auf der Startseite und JSON-LD mit echten Angaben synchron halten ([`index.html`](../index.html)).
- FAQ und `FAQPage`-Schema **gemeinsam** pflegen (keine Antwort nur im Schema).
- Branchen-Landingpages mit klarem Wer/Was/Wo/Für-wen ergänzen (wie [`gastronomie-webseite.html`](../gastronomie-webseite.html)).

## Erledigt = Phase 3

- [x] Feste Prompts + Protokoll-Vorlage (dieses Dokument)
- [ ] Erster Testlauf mit ausgefüllter Zeile pro Prompt (Team)
- [ ] Verantwortliche Person + Speicherort für Protokoll festgelegt (Team)
