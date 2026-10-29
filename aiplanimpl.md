# Implementeringsplan for de tre prioriterede reviewpunkter

Planen dækker kun de tre første fund i `aidocs/aidoc.md`. Den ændrer ikke arkitekturen unødigt og indebærer ikke en komplet omskrivning.

## Mål

1. Ugyldige eller manglende request bodies skal give en kontrolleret klientfejl (400) frem for en utilsigtet 500.
2. Arkivets download skal vise de samme data, som API'et aktuelt arbejder med.
3. Luke-endpointet skal sende klienten videre til en eksisterende route.

## 1. Validér request body og håndtér fejl tydeligt

**Berørte filer:** `src/services/srcService.js`, `src/controllers/srcController.js`; eventuelt `src/app.js` for central Express-fejlhåndtering.

1. Aftal API-kontrakten: POST og PUT kræver et JSON-objekt med `name`, `role` og `planet`. Manglende body, `null`, arrays og andre ikke-objekter er ugyldige.
2. Tilføj en eksplicit body-/payloadvalidering, før properties destruktureres. Behold feltvalideringen for de tre værdier, og lad valideringsfejl have status 400.
3. Gør fejlflowet ensartet: forventede klientfejl returneres med deres status og en forståelig fejlbesked; uventede fejl skal fortsat blive 500 og håndteres centralt i Express i stedet for at blive præsenteret som valideringsfejl.
4. Sørg for, at alle controller-handlere, der kalder servicefunktioner, følger den samme fejlhåndtering. Undgå at kopiere separate `try/catch`-mønstre, hvis fejlmiddleware bruges.

**Acceptkriterier:** Gyldig POST/PUT fortsætter med at virke. Manglende body, `null`, forkert JSON-form og manglende/ugyldige felter giver 400. En uventet serverfejl giver 500 uden at afsløre intern stack trace.

## 2. Brug én datakilde til API og download

**Berørte filer:** `src/data/archive.js`, `src/data/archive.json`, `src/services/srcService.js`, `src/controllers/srcController.js`.

1. Vælg lagringsmodel før implementering. **Anbefalet til projektets nuværende størrelse:** behold `archive.js`'s in-memory array som autoritativ datakilde, og generér downloadindholdet fra de aktuelle entries. Så bliver eksporten korrekt i den kørende proces, uden at introducere filskrivning eller databaseansvar.
2. Fjern controllerens afhængighed af en statisk fil-download: controlleren skal hente eksportdata fra service-/data-laget og sende et JSON-download med passende `Content-Type` og filnavn. Fjern `downloadFile()`-sti-hjælperen, hvis den ikke længere bruges.
3. Beslut eksplicit, om data skal overleve servergenstart. In-memory-modellen gør ikke det; hvis vedvarende data er et krav, skal det være et separat valg af lager og implementeres gennem et repository-lag, der bruges af både CRUD og download. Undgå at skrive til `archive.json` kun i downloadflowet, da det igen giver to datakilder.
4. Afklar formatet for den eksisterende `archive.json`, som aktuelt er ét objekt, før den eventuelt genbruges som persistent lager; et arkiv bør have et konsekvent format for flere entries.

**Acceptkriterier:** Efter oprettelse, opdatering og sletning indeholder download præcis den aktuelle API-tilstand. Downloaden har gyldig JSON og kan parses. Hvis in-memory-lagring beholdes, dokumenteres det, at data nulstilles ved genstart.

## 3. Ret Luke-redirectets destination

**Berørte filer:** `src/controllers/srcController.js` (`getToLuke`), `src/routes/srcRoute.js`; verificér route-mount i `src/app.js`.

1. Bekræft ønsket brugeroplevelse: API-klient skal lande på Luke-ressourcen, eller browseren skal lande på en frontend-side.
2. Hvis destinationen er API-ressourcen, redirect til den eksisterende fulde sti `/api/archive/${luke.id}`. Hvis destinationen er en frontend-side, brug dens faktiske route i stedet.
3. Fjern den eksplicitte `200` før `res.redirect`, så Express bruger redirect-status, og vælg kun en anden redirect-status, hvis klientkravet tilsiger det.
4. Håndtér også tilfældet, hvor Luke ikke findes, som en forventet ressourcefejl (404) frem for 500, hvis fraværet betyder, at posten ikke findes i arkivet.

**Acceptkriterier:** Kald til `/api/gettoluke` returnerer en redirect, hvis `Location` peger på en eksisterende destination; den efterfølgende request giver ikke 404. Hvis Luke mangler, returneres en passende 404.

## Implementeringsrækkefølge og regressionstest

1. Aftal om datalagring skal være midlertidig (in-memory, anbefalet for minimalt scope) eller vedvarende, før punkt 2 implementeres.
2. Implementér bodyvalidering og fælles fejlflow.
3. Implementér datakilde/download-ændringen og beslutningen om genstartspersistens.
4. Ret redirect og den forventede fejlstatus, hvis Luke ikke findes.
5. Tilføj automatiserede tests for hvert acceptkriterium: POST/PUT bodyvarianter, CRUD efterfulgt af download, redirectens status og `Location`, samt manglende Luke.
6. Kør tests og gennemgå ændringsdiffen for at sikre, at eksisterende endpoints og responsformater ikke utilsigtet ændres.
