# Ateljee Mir — Stijlgeheugen

## Identiteit
- **Naam:** Ateljee Mir (vroeger Atelier Mir — altijd de nieuwe spelling gebruiken)
- **Instagram:** @ateljeemir → linkt naar https://www.instagram.com/zij.maakt/
- **Output:** `atelier-mir.html` — single-file HTML portfolio

## Kleurenpalet
```
--dark:  #331012   ← basis tekst- en achtergrondkleur
--beige: #E7E0C5   ← kaartjes, formuliervelden, placeholders
--rose:  #965257   ← accenten, hover states, links, italic taglines
--cream: #FFFAEE   ← pagina-achtergrond, nav, popup-achtergrond
--olive: #94881D   ← beschikbaar maar nog weinig gebruikt
```

## Typografie
- **Hoofdfont:** LouisGeorgeCafe (300 / 400 / 700 + italics via @font-face)
- **Handschrift:** MiriamHandwriting — alleen voor "Miriam" in de bedankt-popup
- **✳ ster-glyph:** altijd LouisGeorgeCafe bold, kleur `var(--rose)`
- `html { zoom: 1.10; }` — pagina is 10% ingezoomd

## Navigatie
- Drie-koloms flex: `220px | flex:1 center | 220px`
- Sticky nav, `background: var(--cream)`
- "Aljee Mir✳" links verschijnt pas als je voorbij de header scrolt (IntersectionObserver)
- Nav-links: Allround Creative | Missie — gecentreerd
- Rechts: ✳ (Over Miriam popup) + 🔍 (zoek overlay)

## Hover-gedrag
- Standaard: `var(--dark)` (#331012)
- Hover: `var(--rose)` (#965257)
- Knop "Versturen": hover wisselt dark ↔ rose (omgekeerd)

## Kaarten-carousel
- 7 kaarten, POS-array heeft 7 elementen (ghost card fix)
- Card-top padding: 36px boven, 26px onder (ruimer boven)
- Titel: 16.5px bold, subtekst: 14.5px light — kleur #fcf6ea

## Contact popup
- Trigger: "Laten we maken →" CTA
- Formuliervelden: background var(--beige), autofill override met webkit-box-shadow
- Bedankt-tekst: "Leuk dat je contact op neemt. / Ik reageer gemiddeld binnen 48 uur."
- Ondertekening: "groetjes," (dark, bold) + "Miriam" (MiriamHandwriting, ~46px, rose)

## Instagram footer
- Grid: 260px | 1fr
- Links: donkere balk var(--dark), tekst var(--cream)
- Tagline "Volg mijn creatieve blik" in var(--rose) italic
- Rechts: Behold.so widget (feed-id nog in te stellen)
- Placeholder zichtbaar zolang feed-id = YOUR_FEED_ID

## Wat Miriam fijn vindt
- Tekst goed afgebroken met text-wrap: balance
- Geen webkit-text-stroke — maakt tekst te zwart
- Spacing: ruim boven, strak onder
- Alles in één HTML-bestand
