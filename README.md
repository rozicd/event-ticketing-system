# event-ticketing-system
Samostalno definisan projekat za ocenu 10.

## Opis aplikacije
Web aplikacija bazirana na mikroservisnoj arhitekturi koja služi za upravljanje događajima u gradovima u Srbiji. Aplikacija razlikuje više vrsta korisnika: Administrator, registrovani i neregistrovani korisnik.

## Funkcionalnosti
Neregistrovani korisnik:

 - Prijava
 - Registracija
 - Ažuriranje lozinke
 - Pregled aktuelnih događaja
 
Registrovani koirsnik:
 - Rezervacija mesta na događaju, ukoliko ima slobodno, unosom broja mesta nakon čega dobija potvrdu o rezervaciji na e-mail
 - Kreiranje sopstvenog događaja pri čemu postaje administrator datog događaja. Događaj može da sadrži i slike (jednu ili više njih). Događaj takođe sadrži i geografske podatke (latitudu i longitudu) koje je moguće videti na mapi. Administrator događaja takođe imaju uvid u sve rezervacije u vezi sa događajem. Prilikom brisanja događaja, svi posetioci tog događaja moraju biti obavešteni email-om. Događaj ne može da se obriše 48h pre nego što počne
 - Ostavljanje recenzije na događajima na kojima je imao rezervisan odlazak. Recenzija sadrži ocenu i komentar
 - Pretraga i filtriranje pretrage po gradu, tipu(koncert, festival, pozorišna predstava), datumu, organizatoru, ceni, broju slobodnih mesta. Organizator vodi prosečku ocenu i recenzije
 - 
Administrator:
 - Za svaki događaj na kojoj je korisnik administrator, moguće je videti broj prodatih karata(rezervisanih mesta) i recenzija događaja na podrazumevano nedeljnom, mesečnom i godišnjem nivou. Moguće je videti periode u danu u kojima je bilo najviše ili najmanje korisnika na zabavi (najviše ili najmanje prometne periode) na dnevnom, nedeljnom i mesečnom nivou. 

## Arhitektura sistema
Backend će se sastojati od 5 mikroservisa.

- servis za pretragu,
- servis za korisnike/auth,
- servis za događaje
- servis za recenzije
- servis za analitiku

Aplikacija će imati svoj api gateaway implementiran u programskom jeziku Python. Servis za korisnike/auth će, takođe, biti implementiran programskom jeziku Python i koristiće SQLite bazu podataka dok će se za ostale servise koristiti Rust programski jezik i PostgreSql za bazu.

Frontend će biti implementiran korišćenjem React-a.
