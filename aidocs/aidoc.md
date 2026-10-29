# Kode-review: Node.js/Express

Reviewet fokuserer på arkitektur, ansvarsfordeling, validering og fejlhåndtering. De tre vigtigste forbedringer er prioriteret nedenfor. Der er ikke behov for en komplet omskrivning.

## 1. Manglende request body bliver rapporteret som serverfejl

**Filer:** `src/services/srcService.js` (`createEntry`, linje 22; `updateEntry`, linje 37) og `src/controllers/srcController.js` (`handleError`, linje 3-5; `createEntry` og `updateEntry`, linje 21-35).

Service-funktionernes parametre destrukturerer body direkte. Hvis klienten sender en POST uden body eller en PUT med `null`/manglende body, opstår en `TypeError`, før servicevalideringen kan køre. Controlleren fanger fejlen, og `handleError` svarer med status 500, fordi fejlen ikke har en `status`-værdi. Det får en ugyldig klientforespørgsel til at ligne en fejl i serveren.

**Anbefaling:** Kontrollér først, at body er et objekt, og at de krævede felter er til stede. Svar med 400 for ugyldige input; reserver 500 til uventede serverfejl.

## 2. Download og API bruger forskellige datakilder

**Filer:** `src/data/archive.js` (linje 1-16), `src/services/srcService.js` (`downloadFile`, linje 100-102) og `src/controllers/srcController.js` (`download`, linje 46-56); den downloadede fil er `src/data/archive.json`.

CRUD-funktionerne læser og ændrer arrayet i `archive.js`, men downloadfunktionen returnerer en sti til den statiske `archive.json`. Filen indeholder kun startposten og opdateres ikke, når API'et opretter, ændrer eller sletter poster. Brugeren kan derfor hente en arkivfil, der ikke afspejler den aktuelle API-tilstand. Desuden forsvinder ændringer i arrayet ved servergenstart.

**Anbefaling:** Brug én autoritativ datakilde. Hvis download skal afspejle den aktuelle tilstand, så generér eksporten fra de aktuelle entries; hvis data skal overleve genstart, så gem CRUD-ændringerne i vedvarende lagring.

## 3. Luke-redirectet peger uden for API'ets route-base

**Filer:** `src/controllers/srcController.js` (`getToLuke`, linje 59-62), `src/routes/srcRoute.js` (linje 8 og 10) og `src/app.js` (route-mount under `/api`).

Endpointet er registreret som `/api/gettoluke`, men controlleren redirecter til `/archive/:id`. Det endelige endpoint er `/api/archive/:id`, så redirectets sti matcher ikke den registrerede route, og klienten ender på 404.

**Anbefaling:** Redirect til den fulde API-sti (`/api/archive/${luke.id}`), eller til den tilsigtede frontend-sti, hvis redirectet skal vise en side frem for API-data.

## Yderligere forbedringer

Disse er forslag ud over de tre fund ovenfor og kræver ikke en omskrivning.

### 4. Validér ID'er før opslag

**Fil:** `src/services/srcService.js` (`getEntryById`, linje 15-16; `deleteEntry`, linje 49-50).

`parseInt` accepterer delvist numeriske værdier: f.eks. bliver `"1abc"` fortolket som ID `1`. Derfor kan en ugyldig sti som `/api/archive/1abc` hente, opdatere eller slette posten med ID 1 i stedet for at blive afvist.

**Anbefaling:** Validér, at ID'et er et positivt heltal med en streng, fuldstændig konvertering, før det bruges i opslag. Returnér 400 for ugyldigt format og 404 for et gyldigt ID, der ikke findes.

### 5. Gør valideringen konsekvent og normalisér input

**Fil:** `src/services/srcService.js` (`validateName`, linje 57-67; `validatePlanet`, linje 91-98; `createEntry`, linje 22-35).

Navnet kontrolleres med `trim()`, men den oprindelige værdi gemmes. Planeter kontrolleres ikke for tomt indhold efter trimning, så `"   "` accepteres. Det kan give data med skjulte mellemrum eller værdier, der ser udfyldt ud, men ikke er meningsfulde.

**Anbefaling:** Trim strengfelter én gang før validering og lagring, og definér eksplicitte regler for tomme værdier og eventuelle længdegrænser. Brug de samme regler ved oprettelse og opdatering.

### 6. Tilføj automatiserede regressionstests

**Filer:** `package.json` (`test`-scriptet) og `src/services/srcService.js` / `src/controllers/srcController.js`.

`npm test` er i øjeblikket kun et placeholder-script, der fejler, og de beskrevne tests er manuelle Postman-kald. Det gør det let at genindføre fejl i validering, statuskoder eller CRUD-flow, når koden ændres.

**Anbefaling:** Start med tests for gyldige og ugyldige bodies, ID'er som `"1abc"`, ikke-eksisterende poster og oprettelse/opdatering/sletning. Kontrollér både statuskode og responsformat; behold eventuelt Postman til manuel udforskning.

### 7. Brug en tom respons ved HTTP 204

**Fil:** `src/controllers/srcController.js` (`deleteEntry`, linje 37-40).

Status 204 betyder, at svaret ikke har en body. Koden forsøger samtidig at sende JSON med statusbeskeden; klienter bør ikke være afhængige af den body, og adfærden kan være forvirrende.

**Anbefaling:** Send 204 uden body, eller vælg en status som 200, hvis klienten skal modtage en JSON-besked.