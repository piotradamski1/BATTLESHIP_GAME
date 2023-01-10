# STATKI_GAME
Popularna gra w statki w której gramy z komputerem <br/>
Wykorzystane technologie: JS, HTML, CSS <br/>
Layout: <br/>
![1](https://user-images.githubusercontent.com/122048598/211676981-96e6646a-7aa7-4a9c-a934-067c4925bd73.PNG) <br/>
Jest możliwość zmiany const w kodzie (rozmiar planszy oraz ilość i długość statków).<br/>
Funkcje są krótko zakomentowane. <br/>
<br/>
Streszczenie działania:
1. Wygenerowanie statków z "kwadratów" np. statek o długości 3 składa się z 3 kwadratów. Gracz zaznacza który statek chce postawić na planszy, po postawieniu statek znika
2. Wyświetlenie pustej planszy na której gracz ma postawić swoje statki (gra nie pozwoli graczowi na postawienie statku nie zgodnie z zasadami). Gracz ma możliwość obrotu statku.
3. Wylosowanie ułożenia statków "komputera" (czyli przeciwnika)

Po czym rozpoczony się rozgrywka w której to gracz i "komputer" na zmianę oddają strzały na tablice gdy pudłują pojawia się O gdy trafią X a gdy zatopią statek podświetla się. Dodatkowo na górze strony są wyświetlane wiadomości do gracza które przedstawia obecną sytuację w grze czyli co gracz ma zrobić, kogo jest ruch oraz np rezultat strzału.

Wszystkie operacje logiczne odbywaja się na tablicach 2d
