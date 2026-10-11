# Écrire ou étoffer une page de « Overtime Ledger » (overtimeledger.com)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : heures de travail et paie à l'heure aux États-Unis. Feuille de temps hebdomadaire (accueil), heures entre deux heures, heure militaire, heures décimales, heures sup fédérales (FLSA) et des quatre États à heures sup journalières (Californie, Alaska, Nevada, Colorado), salaire ↔ taux horaire, calendrier des paies 2026, jours ouvrés, congés payés. **Anglais américain seul**, sous `/en/`. Dollars, `$` devant, virgule des milliers. Éditeur : la société **Radif Partners** (jamais un nom de personne, ni photo, ni INSEAD, ni Mines, ni LinkedIn). Aucun lien vers un autre site du portefeuille (`_trame/domaines-ovh.txt`), jamais « taxineo ».

**L'angle** (rapport SERP `~/Documents/GitHub/reports/us-work-hours-serp-2026-10-11.md`) : le premier résultat (redcort) et calculator.net s'arrêtent au total d'heures ou renvoient vers un logiciel ; ici la feuille arrondit selon 29 CFR 785.48, retire les pauses selon 785.18/785.19, applique les heures sup journalières des États d'après les textes 2026 et donne la paie brute imprimable.

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Calculateur ou guide | `src/content/pages/<id>.ts` (`definePage`) | `/en/<slug>/` |
| Accueil | `src/content/home.ts` (+ `src/components/HomePage.astro`) | `/en/` |
| Méthode, à propos, légal | `src/pages/en/*.astro` | |

Modèle : `src/content/pages/overtime-calculator.ts`. Copier la **structure**, jamais les phrases.

Le composant `ContentPage.astro` affiche seul : le calculateur (`tool`, `toolProps`), le chapeau replié (`resume`, première phrase visible), le corps (`body`), la FAQ, les pages liées, les sources.

### Champs (`definePage`)

| Champ | Règle |
|---|---|
| `id` = `slug` = nom du fichier | minuscules et tirets, sans année, sans nombre de 3 chiffres ; éviter `contact`, `legal`, `method`, `cookie`, `conditions`, `about`, `terms`, `widget` |
| `group`, `order` | `clock`, `overtime`, `pay`, `calendar`, `leave` ; ordre par pas de 10 |
| `title` | 50 à 60 caractères, contient 2026, **le terme-clé en tête** (« Biweekly Pay Schedule 2026: … ») ; jamais How/What/Is/Calculator, ni US/American en tête ; pas de tiret cadratin ni demi-cadratin ; unique |
| `description` | 150 à 160 caractères, contient 2026 et un chiffre tiré des paramètres ; unique |
| `h1`, `intro`, `nav`, `card` | H1 sans année ; une phrase ; libellé court ; une phrase pour les cartes |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à la requête avec les chiffres ; la première phrase porte le message (elle seule est visible). Ne pas commencer la 2ᵉ phrase par un chiffre. |
| `body(h)` | HTML : `h2`, `h3`, `p`, `ul`, `h.table(...)`. **≥ 450 mots de prose hors tableaux** (viser 550 à 800). Deux ou trois `h2` propres à la page |
| `faqs` | 4 à 8 vraies questions, réponses de **45 à 85 mots** (le test compte 42 à 88), chiffre + condition + source, uniques sur tout le site |
| `tool` | le calculateur de la page (liste plus bas) ; `toolProps: { state: 'california', lock: true }` pour figer l'État |
| `related` | 3 à 6 ids existants |
| `sources` | ≥ 3 clés de `src/data/params-2026.json > sources` |

### Les outils `h` du corps

`h.a(id, texte)` lien interne (id inconnu = test en échec) · `h.src(clé, texte?)` lien vers une source officielle · `h.table(entêtes, lignes, légende, align)` · `h.box(titre, html)` encadré · `h.mini(kind, arg?)` mini-simulateur placé dans le corps · tout le kit : `h.usd(n, d)`, `h.num(n, d)`, `h.hrs(h)`, `h.day(iso)`, `h.F` (fédéral), `h.ca`, `h.ak`, `h.nv`, `h.co`, `h.nvDailyLimit`, `h.caExemptAnnual`, `h.week(heures[7], 'california', taux)` → `{ reg, ot, dt, total, pay: { total } }`, `h.time.*` (parseClock, shiftMinutes, roundTo, hm, to12h, to24h, toMilitary), `h.pay.*` (salaryToHourly, salaryToHourlyOpm, hourlyToAnnual, weightedOvertime, salariedHalfTime, freelanceRate), `h.cal.*` (federalHolidays, workingDaysByMonth, businessDaysBetween, addBusinessDays, paydays, weekdayCount, daysBetween), `h.pto.*`. Dans les champs hors `body`, importer `KIT as K` de `../../lib/kit` (voir le modèle).

**Règle des chiffres** : aucune valeur réglementaire écrite en dur (40 heures, 8 heures, 16,90 $, 684 $, 2 087…). Tout vient de `K.*`, calculé par le moteur. Un chiffre incertain ne se publie pas.

### Calculateurs (`tool`)

`timecard`, `timesheet` (2 semaines), `hours`, `clock-in-out`, `work-hours`, `time-sum`, `time-clock`, `duration`, `military`, `hm-decimal`, `payroll-hours`, `overtime`, `time-and-a-half`, `double-time`, `regular-rate`, `salaried-ot`, `salary-to-hourly`, `hourly-to-salary`, `hourly-rate`, `biweekly-pay`, `pay-schedule`, `pay-periods`, `business-days`, `working-days`, `days-between`, `weeks-between`, `date-add`, `pto`, `pto-accrual`, `ca-sick`.

### Mini-simulateurs (`src/lib/minis/<kind>.ts`)

`otDay` (arg : clé d'État), `rounding`, `decimal`, `breakPay`, `exempt`, `paydayCount`, `workdays`, `sickCa`, `yearHours`, `nvCheck`. Un nouveau mini = un fichier, qui appelle le moteur.

## Les faits établis (2026-10-11), tous dans `params-2026.json`

- FLSA : heures sup après 40 h par semaine de travail à 1,5 fois le taux régulier ; semaine fixe de 168 h choisie par l'employeur ; pas de moyenne sur deux semaines ; pas d'obligation pour samedi, dimanche, jours fériés (Fact Sheet #23). Minimum fédéral 7,25 $. Seuil de salaire des exemptés 684 $/semaine (35 568 $/an), HCE 107 432 $ (page DOL salary levels).
- Pauses : 5 à 20 min payées (785.18) ; repas de 30 min ou plus non payé si libéré de toute tâche (785.19) ; la FLSA n'impose pas de pause (Fact Sheet #22).
- Arrondi : 5 min, dixième ou quart d'heure, accepté s'il s'équilibre dans le temps (785.48(b)).
- Deux taux : taux régulier = moyenne pondérée, prime = moitié par heure sup (778.115).
- Californie : 1,5x après 8 h/jour jusqu'à 12, 2x après 12 ; 7ᵉ jour consécutif : 8 premières heures 1,5x, au-delà 2x ; 40 h/semaine (DLSE). Minimum 16,90 $ au 1ᵉʳ janvier 2026. Exemptés : 2 fois le minimum à temps plein (70 304 $ calculés). Repas 30 min au-delà de 5 h, second au-delà de 10 h ; repos 10 min par 4 h, pas exigé sous 3 h 30 ; une heure de paie par jour de pause manquée. Congé maladie : 1 h pour 30 h, usage d'au moins 40 h ou 5 jours, plafond d'accumulation au moins 80 h ou 10 jours (depuis le 1ᵉʳ janvier 2024).
- Alaska : 1,5x après 8 h/jour et 40 h/semaine, employeurs de 4 salariés ou plus ; plan d'horaire flexible approuvé : 10 h/jour. Minimum 14,00 $ (table DOL).
- Nevada : minimum 12,00 $ ; heures sup après 8 h/jour seulement pour un taux inférieur à 1,5 fois le minimum (18,00 $), sinon après 40 h/semaine (table DOL). Les autres détails de la NRS 608.018 n'ont pas pu être lus (site de la législature fermé aux robots) : ne pas les publier.
- Colorado : COMPS Order #40 en vigueur au 1ᵉʳ février 2026 : 1,5x après 40 h/semaine, 12 h/jour ou 12 h consécutives, le calcul le plus favorable s'applique ; repas 30 min au-delà de 5 h consécutives ; repos payé 10 min par 4 h. Minimum 15,16 $ (15,71 $ en 2027).
- Autres règles (table DOL) : Kentucky « Weekly 40, 7th day », Porto Rico « Daily 8, Weekly 40 », îles Vierges, Minnesota 48 h.
- 2026 : 11 jours fériés fédéraux (OPM), 4 juillet un samedi → vendredi 3 juillet ; 261 jours de semaine, 250 jours ouvrés ; 53 jeudis.
- OPM : diviseur de 2 087 heures (5 U.S.C. 5504(b)).

## Ton et langue

Anglais américain, voix humaine, phrases de longueur variable, le chiffre d'abord. Interdits : tiret cadratin et demi-cadratin, « it's important to note », « dive into », « whether you're », « Moreover/Additionally/Furthermore », « delve », « navigate the », « unlock », conclusions-résumés, émojis. Unicité : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 % ; écrire ce qui n'appartient qu'au sujet de la page, avec un vocabulaire propre.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/overtimeledger.com
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=<id> npx vitest run tests/pages.test.ts   # une fiche seule
npm run build                                          # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
python3 scripts/check-snippets.py . ; python3 scripts/check-cookies.py . ; python3 scripts/check-liens.py dist
node scripts/check-sources.mjs . ; node scripts/check-legal.mjs . ; node scripts/typo-nbsp.mjs dist --check
node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60 ; node scripts/check-nombres.mjs dist
node scripts/check-url-propre.mjs dist ; node scripts/check-layout.mjs dist > /tmp/layout-uwh.log 2>&1 &
```

Serveur local : port **4401** (`npm run preview`). Arrêt par le port (`lsof -ti tcp:4401 | xargs kill`), jamais `pkill -f`.

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS. Ne pas toucher à `_trame` ni à la RECETTE. Commits locaux en français, dernière ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
