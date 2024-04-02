# event-ticketing-system
Samostalno definisan projekat za ocenu 10.

## Opis aplikacije
Web aplikacija za upravljanje događajima u različitim gradovima u Srbiji. U sistemu će biti tri vrste korisnika - admin, registrovani korisnik i neregistrovani korisnik. Admin će biti zadužen za CRUD operacije nad svim entitetima, ali fokus će mu biti kreiranju, brisanju i izmenu događaja kao i kreiranju novih admina. registrovani korisnik će moći da vidi sve kreirane događaje, da ih pretražuje i filtrira pretragu po gradu, tipu(koncert, festival, pozorišna predstava, ...) i datumu. Neregistrovani korisnik može da kreira novi nalog i da se prijavi na sistem.
## Tehnologije
Za klijentski deo aplikacije koristiće se React, za serverski deo Rust, a za bazu Postgres.
