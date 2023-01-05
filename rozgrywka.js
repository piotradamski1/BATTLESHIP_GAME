const statki = [4,3,3,2,2,2,1,1,1,1]; 
const ilosc_statkow = statki.length;
const rozmiar_planszy = 10;
var wybrany, rozmieszczonych_statkow, stan_gry, plansza, plansza_komp, czy_plansza_komp_odslonieta;

start_gry();

//start gry
function start_gry(){
    wybrany = {rozmiar: 4, nazwa: "statek0", indeks: 0};
    rozmieszczonych_statkow = 0;
    stan_gry = {twoj_ruch: false, twoje: ilosc_statkow, komp: ilosc_statkow};
    statki_do_rozmieszczenia();
    plansza = pusta_plansza();
    wyswietlenie_planszy(plansza,"gracz");
    czy_plansza_komp_odslonieta = false;
    plansza_komp = wylosowanie_planszy_komputera();
    wyswietlenie_planszy(plansza_komp,"komputer");
    rozmieszczanie_statkow();
}

//obsluga komunikatow dla gracza 
function powiadomienie(wiadomosc, id){
    document.getElementById(id).firstChild.innerHTML = wiadomosc;
}

//losuje i zwraca plansze 'komputera' z zachowaniem odpowiednich zasad stawiania statkow
function wylosowanie_planszy_komputera(){
    let plansza_komputera = pusta_plansza();
    let kierunek,rozm,poz_x,poz_y,box,x,y;
    let n = 0;
    while(n<ilosc_statkow){
        kierunek=Math.round(Math.random())==0 ? "poziomy" : "pionowy";
        rozm = statki[n];
        poz_x = Math.floor(Math.random() * (rozmiar_planszy));
        poz_y = Math.floor(Math.random() * (rozmiar_planszy-statki[n]+1));
        if(kierunek=="pionowy"){
            box = poz_x;
            poz_x = poz_y;
            poz_y = box;
        }
        if(sprawdz_mozliwosc_postawienia_statku(kierunek,poz_x, poz_y, rozm, plansza_komputera)){
            for(let i=0; i<rozm; i++){
                x = kierunek=="poziomy"? poz_x+1 : poz_x+1+i;
                y = kierunek=="poziomy"? poz_y+1+i : poz_y+1;
                plansza_komputera[x][y] = {nr: 1, kier: kierunek, rozm: rozm, ktory: i};
            }
            n++;
        }
    }
    powiadomienie("KOMPUTER: "+stan_gry.komp+" statków","title_komputer");
    return plansza_komputera;
}

//zwraca pusta plansze
function pusta_plansza(){
    var plansza = [];
    for (let i = 0; i<rozmiar_planszy+2; i++){
        plansza[i] = [];
    }
    for(let i=0; i<rozmiar_planszy+2; i++)
	    for(let j=0; j<rozmiar_planszy+2; j++)
	    plansza[i][j] = {nr: 0, kier: null, rozm: null, ktory: null};
    return plansza;
}

//obsluguje statki do rozmieszczenia (pokazanie, podswietlenie, zaznaczanie, usuwanie)
function statki_do_rozmieszczenia(){
    if(document.getElementById("ships").firstChild){
        document.getElementById("ships").firstChild.remove();
    }
    let statki_box = document.createElement("div");
    statki_box.id ="statki";
    document.getElementById("ships").appendChild(statki_box);
    for(let i=0; i<ilosc_statkow; i++){
        let statek = document.createElement("div")
        statek.id="statek"+i
        for(let j=0; j<statki[i]; j++){
            let kwadrat = document.createElement("div")
            if(j==0)
                statek.style.clear = "both;"
            statek.appendChild(kwadrat);
        }  
        statek.addEventListener("mouseover", function(){
            if(this.id!=wybrany.nazwa){
                let dzieci = statek.children;
                for(let i = 0; i<dzieci.length; i++){
                    dzieci[i].style.background = "skyblue";  
                } 
            }
        });
        statek.addEventListener("mouseout", function(){
            if(this.id!=wybrany.nazwa){
                let dzieci = statek.children;
                for(let i = 0; i<dzieci.length; i++){
                    dzieci[i].style.background = "white";  
                } 
            }
        });
        statek.addEventListener("click", function(){
            zaznacz_statek(this.id)}); //zaznacza statek po kliknieciu na niego
        document.getElementById("statki").appendChild(statek); 
    }
    zaznacz_statek("statek0"); //wykonuje sie raz zaznacza pierwszy statek
    powiadomienie("Wybierz statek i umieść go na planszy (PPM - obrót statku)","polecenie");
}

//zaznacza kolorem statek wybrany przez gracza
function zaznacz_statek(statek){
    let dzieci = document.getElementById(wybrany.nazwa).children;
    for(let i = 0; i<dzieci.length; i++){
        dzieci[i].style.background = "white";  
    }
    dzieci = document.getElementById(statek).children;
    for(let i = 0; i<dzieci.length; i++){
        dzieci[i].style.background = "blue";  
    }
    wybrany = {rozmiar: dzieci.length, nazwa: statek, indeks: statek.slice(-1)};
}

//obsluguje rozmieszczenie statkow przez gracza na planszy
//w tym: obrot statku, podswietlenie, postawienie na planszy
//w przypadku wybrania zlego miejsca: podswietlenie na czerwono i brak mozliwosci postawienia
function rozmieszczanie_statkow(){
    var statek_poziomy = true;
    let pola = document.getElementsByClassName("pole");
    for(let i = 0; i<pola.length; i++){
        pola[i].addEventListener("contextmenu", function(e) {
            e.preventDefault();
            statek_poziomy = statek_poziomy? false : true;
            wyczysc_podglad();
            pokaz_podglad(i);
            });
        pola[i].addEventListener("mouseover", function(){
            pokaz_podglad(i);
        });
        pola[i].addEventListener("mouseout", wyczysc_podglad);
        pola[i].addEventListener("click", function(){
            postawienie_statku(i);
        });
    }
    function podgladnij_pola_statku(i){
        let sprawdzrozmiar = statek_poziomy? i%rozmiar_planszy : Math.floor(i/rozmiar_planszy);
        let mnoznik = statek_poziomy? 1 : rozmiar_planszy;
        let nr_pola;
        let podgladowe_pola = [];
        if(sprawdzrozmiar<=rozmiar_planszy-wybrany.rozmiar){   
            for(let j = 0; j<wybrany.rozmiar; j++){
                nr_pola = i+j*mnoznik;
                podgladowe_pola.push(nr_pola);
            }
        }
        else{
            for(let j = 0; j<wybrany.rozmiar; j++){
                nr_pola = i-(sprawdzrozmiar-(rozmiar_planszy-wybrany.rozmiar))*mnoznik+j*mnoznik;
                podgladowe_pola.push(nr_pola);
            }
        }
        return podgladowe_pola;
    }
    function pokaz_podglad(i){
        let podgladowe_pola = podgladnij_pola_statku(i);
        let kier = statek_poziomy ? "poziomy" : "pionowy";
        let x = Math.floor(podgladowe_pola[0]/rozmiar_planszy);
        let y = podgladowe_pola[0]%rozmiar_planszy;
        let rozm = podgladowe_pola.length;
        let kolor = sprawdz_mozliwosc_postawienia_statku(kier,x,y,rozm,plansza)? "skyblue" : "tomato";
        for(let j = 0; j<podgladowe_pola.length; j++){
            if(pola[podgladowe_pola[j]].style.backgroundColor!="blue"){
                pola[podgladowe_pola[j]].style.background = kolor;
            }
        }
    }
    function wyczysc_podglad(){
        for(let j = 0; j<pola.length; j++){
            if(pola[j].style.backgroundColor!="blue"){
                pola[j].style.background="white";
            }
        }
    }
    function postawienie_statku(i){
        let podgladowe_pola = podgladnij_pola_statku(i);
        let kier = statek_poziomy ? "poziomy" : "pionowy";
        let x = Math.floor(podgladowe_pola[0]/rozmiar_planszy);
        let y = podgladowe_pola[0]%rozmiar_planszy;
        let rozm = podgladowe_pola.length;
        if(sprawdz_mozliwosc_postawienia_statku(kier,x,y,rozm,plansza)){
            for(let j = 0; j<podgladowe_pola.length; j++){
                pola[podgladowe_pola[j]].style.background = "blue";
                x = Math.floor(podgladowe_pola[j]/rozmiar_planszy);
                y = podgladowe_pola[j]%rozmiar_planszy;
                plansza[x+1][y+1] = {nr: 1, kier: kier, rozm: rozm, ktory: j};
            }
            document.getElementById(wybrany.nazwa).remove();
            let pozostale_statki = document.getElementById("statki").children;
            if(pozostale_statki.length>0){
                let nast_statek = pozostale_statki[0];
                wybrany = {rozmiar: nast_statek.children.length, nazwa: nast_statek.id, indeks: nast_statek.id.slice(-1)};
                zaznacz_statek(nast_statek.id);
            }
            rozmieszczonych_statkow++;
            if(rozmieszczonych_statkow>=statki.length){
                koniec_rozmieszczania();
            }
        }
    }
}

//wywolywana gdy wszystkie statki zostaly rozmieszczone przez gracza
//rozpoczyna sie rozgrywka (ruch gracza)
function koniec_rozmieszczania(){
    var przykrywka = document.createElement("Div");
    przykrywka.id = "przykrywka";
    document.getElementById("gracz").appendChild(przykrywka);
    document.getElementById("title_statki").firstChild.textContent = "";
    powiadomienie("TWÓJ RUCH: oddaj 'strzał' na planszy komputera","polecenie");
    powiadomienie("GRACZ: "+stan_gry.twoje+" statków","title_gracz");
    stan_gry.twoj_ruch=true;
}


//zwraca true lub false w zaleznosci czy jest mozliwosc postawienia danego statku (kierunek, rozmiar)
//na danej planszy w danym miejscu (wspolrzedne x,y)
function sprawdz_mozliwosc_postawienia_statku(kier, x, y, rozm, plansza){
    let check = true;
    let posx, posy;
    for(let i=0; i<rozm+2; i++){
        for(let j=0; j<3; j++){
            posx=kier=="poziomy"? x+j : x+i;
            posy=kier=="poziomy"? y+i : y+j;
            if(plansza[posx][posy].nr!=0){
                check=false;
            }   
        }        
    } 
    return check;
}

//wyswietla plansze na podstawie danej tablicy
function wyswietlenie_planszy(plansza, id_planszy){
    var el_komputer = document.getElementById(id_planszy);
    if(el_komputer.firstChild&&el_komputer.firstChild.id!="przykrywka"){
        el_komputer.firstChild.remove();
    }
    else if(el_komputer.firstChild&&el_komputer.firstChild.id=="przykrywka"){
        el_komputer.lastChild.remove();
    }
    var parent = document.createElement("div")
    for(var i=0; i<rozmiar_planszy+2; i++){
        for(var j=0; j<rozmiar_planszy+2; j++){
            let kwadrat = document.createElement("div")
            if(i==0&&j!=0&&j!=11){
                kwadrat.innerHTML = '<p>'+j+'</p>';
            }
            else if(j==0&&i!=0&i!=11){
                kwadrat.innerHTML = '<p>'+String.fromCharCode(96+i)+'</p>';
            }
            if(i==0 || j==0 || i==11 || j==11) 
                kwadrat.className = "clean"
            else {
                kwadrat.className = id_planszy=="gracz"? "pole" : "pole_komp";
                if(id_planszy=="gracz"&&plansza[i][j].nr==1){
                    kwadrat.style.background = "blue";
                }
                if(id_planszy=="komputer"&&czy_plansza_komp_odslonieta&&plansza[i][j].nr==1){
                    kwadrat.style.background = "red";
                }
                else if(plansza[i][j].nr==2){ //pudlo
                    kwadrat.innerText = "O";
                }
                else if(plansza[i][j].nr==-1){ //trafiony
                    kwadrat.innerText = "X";
                    if(id_planszy=="gracz"){
                        kwadrat.style.background = "blue";
                    }
                    else if(id_planszy=="komputer"&&czy_plansza_komp_odslonieta){
                        kwadrat.style.background = "red";
                    }
                }
                else if(plansza[i][j].nr==-2){ //zatopiony
                    kwadrat.innerText = "X";
                    kwadrat.style.background = "lightgray";
                }
                kwadrat.setAttribute("x",i);
                kwadrat.setAttribute("y", j);
            }
            if(id_planszy=="komputer"){
                parent.onclick = strzelanie_gracza;
            }
            parent.appendChild(kwadrat)
        }
    }
    document.getElementById(id_planszy).appendChild(parent);
}

//gdy jest ruch gracza pozwala mu na wybranie pola w ktore chce oddac strzal
function strzelanie_gracza(ev){
    if(stan_gry.twoj_ruch){
        let x = parseInt(ev.target.getAttribute("x"));
        let y = parseInt(ev.target.getAttribute("y"));
        if(plansza_komp[x][y].nr==0||plansza_komp[x][y].nr==1){
            rozgrywka(x,y,plansza_komp,"komputer");
        }
        
    }
}

//losowane sa wspolrzedne w ktore strzeli komputer; TODO potencjalnie do rozbudowania
function strzelanie_komputera(){
    let x = Math.floor(Math.random() * (rozmiar_planszy))+1;
    let y = Math.floor(Math.random() * (rozmiar_planszy))+1;
    if(plansza[x][y].nr==0||plansza[x][y].nr==1){
        setTimeout(function(){
            rozgrywka(x,y,plansza,"gracz")
        },1000);
    }
    else{
        strzelanie_komputera();
    }
}

//w zaleznosci dla ktorego gracza jest wywolana obsluguje wynik 'strzalu' na danej planszy
//(pudlo/trafiony/zatopiony) oraz sprawdza czy ktorys z graczy wygral
function rozgrywka(x,y,pl,id_planszy){
    let wiad,zatopiony;
    if(pl[x][y].nr==0){
        pl[x][y].nr=2;
        wiad="Pudło!";
    }
    else if(pl[x][y].nr==1){
        pl[x][y].nr=-1;
        wiad="Trafiony!"
        zatopiony = czy_zatopiony(pl,x,y);
        if(zatopiony){
            if(id_planszy=="komputer"){
                stan_gry.komp--;
                powiadomienie("KOMPUTER: "+stan_gry.komp+" statków","title_komputer");
                if(stan_gry.komp==0){
                    koniec_gry(true);
                }
            }
            else if(id_planszy=="gracz"){
                stan_gry.twoje--;
                powiadomienie("GRACZ: "+stan_gry.twoje+" statków","title_gracz");
                if(stan_gry.twoje==0){
                    koniec_gry(false);
                }
            }
            pl=zatopiony;
            wiad= "Trafiony zatopiony!"
        }        
    }
    wyswietlenie_planszy(pl, id_planszy);
    if(stan_gry.twoj_ruch){
        plansza_komp=pl;
        stan_gry.twoj_ruch=false;
        powiadomienie(wiad+" - RUCH KOMPUTERA","polecenie");
        strzelanie_komputera();
    }
    else if(!stan_gry.twoj_ruch){
        plansza=pl;
        stan_gry.twoj_ruch=true;
        powiadomienie(wiad+" - TWÓJ RUCH","polecenie");
    }
}

//funkcja wywolywana jest przy trafieniu statku, sprawdza czy to trafienie zatopilo statek
function czy_zatopiony(plansza,x,y){
    let czy_y = plansza[x][y].kier=="poziomy"? 1 : 0;
    let czy_x = czy_y==1? 0 : 1;
    let wart,check = true;
    for(let i = 0; i<plansza[x][y].rozm; i++){
        wart = i-(plansza[x][y].ktory);
        if(plansza[x+(wart*czy_x)][y+(wart*czy_y)].nr!=-1){
            check=false;
        }
    }
    if(check){
        for(let i = 0; i<plansza[x][y].rozm; i++){
            wart = i-(plansza[x][y].ktory);
            plansza[x+(wart*czy_x)][y+(wart*czy_y)].nr=-2;
        }
        return plansza;
    }   
    else{
        return false;
    }
}

//konczy gre gdy ktorys z graczy nie ma juz statkow
function koniec_gry(win){
    let tresc = win? "WYGRAŁEŚ!" : "PRZEGRAŁEŚ!";
    let end = document.createElement("div");
    end.id = "end";
    let result = document.createElement("h1");
    result.innerHTML = tresc;
    result.style.color=win? "lawngreen" : "red";
    end.appendChild(result);
    let btn = document.createElement("div");
    btn.innerHTML = "<p>ZAGRAJ PONOWNIE</p>";
    btn.onclick = function(){
        location.reload();
    }
    end.appendChild(btn);
    document.getElementById("main").appendChild(end);
}

//obsluga buttona do odslaniania planszy
function odslon_plansze_komp(){
    czy_plansza_komp_odslonieta = czy_plansza_komp_odslonieta? false : true;
    wyswietlenie_planszy(plansza_komp, "komputer")
}