# Flyt.Cloud

Følgende repository inkluderer all tilhørende kode ved webapplikasjonen Flyt.Cloud. 

For å utføre videre arbeid og vedlikehold ved webapplikasjonen vil følgende installeringsmetode være gjellende. 

## Krav
Det er nødvendig med node.js og en kode editor (Testet med Visual Studio Code med Azure Functions addon).

## Oppstart
- Klone repositoriet gjennom GitClone.

- Åpne klonet mappe i kodeeditoren. 


- For oppstart av frontend, naviger til 'Frontend'-mappen ved klonet materiale. 

- Åpne en bash/powershell terminal og tast inn kommandoen:

```powershell
npm start
```

- For oppstart av backend, naviger til 'Backend'-mappen ved klonet materiale.

- Åpne koden i en kode editor og trykk på F5.


NB! Ved lokal testing, pass på at postLogoutRedirectUri og redirectUri ved /Frontend/src/azure/authConfig.ts er satt til 'http://localhost:3000'.

## Distribuering

Repositoriet er koblet opp mot en pipeline distribuerer koden til Microsoft Azure gjennom en trigger ved main-branch. Dersom det er ikke ønskelig å publisere endringen til domenet vil det være nødvendig å opprette en development branch ved siden av main. 
