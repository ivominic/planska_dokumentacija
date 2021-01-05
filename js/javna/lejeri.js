let drvece = kreirajNoviImageWmsLejer("Drveće", "drvece_v", "winsoft:drvece_v");
let zbunjeLinija = kreirajNoviImageWmsLejer("Žbunje linija", "zbunje_linija_v", "winsoft:zbunje_linija_v");
let zbunjeTacka = kreirajNoviImageWmsLejer("Žbunje tačka", "zbunje_tacka_v", "winsoft:zbunje_tacka_v");
let zelenePovrsine = kreirajNoviImageWmsLejer("Zelene površine", "zelene_povrsine_v", "winsoft:zelene_povrsine_v");
let urbaniMobilijar = kreirajNoviImageWmsLejer("Urbani mobilijar", "urbani_mobilijar_v", "winsoft:urbani_mobilijar_v");
let rekreativnePovrsine = kreirajNoviImageWmsLejer("Rekreativne površine", "rekreativne_povrsine_v", "winsoft:rekreativne_povrsine_v");
let staze = kreirajNoviImageWmsLejer("Staze", "staze", "winsoft:staze");
let granica = kreirajNoviImageWmsLejer("Granica", "granica", "winsoft:granica");

map.addLayer(granica);
map.addLayer(staze);
map.addLayer(rekreativnePovrsine);
map.addLayer(urbaniMobilijar);
map.addLayer(zelenePovrsine);
map.addLayer(zbunjeTacka);
map.addLayer(zbunjeLinija);
map.addLayer(drvece);

document.querySelector("#chkDrvece").addEventListener("change", function () {
    drvece.setVisible(this.checked);
});
document.querySelector("#chkZbunjeLinija").addEventListener("change", function () {
    zbunjeLinija.setVisible(this.checked);
});
document.querySelector("#chkZbunjeTacka").addEventListener("change", function () {
    zbunjeTacka.setVisible(this.checked);
});
document.querySelector("#chkZelenePovrsine").addEventListener("change", function () {
    zelenePovrsine.setVisible(this.checked);
});
document.querySelector("#chkUrbaniMobilijar").addEventListener("change", function () {
    urbaniMobilijar.setVisible(this.checked);
});
document.querySelector("#chkRekreativnePovrsine").addEventListener("change", function () {
    rekreativnePovrsine.setVisible(this.checked);
});
document.querySelector("#chkStaze").addEventListener("change", function () {
    staze.setVisible(this.checked);
});
document.querySelector("#chkGranica").addEventListener("change", function () {
    granica.setVisible(this.checked);
});

document.querySelector("#radioOsm").addEventListener("change", function () {
    map.getLayers().setAt(0, osmBaseMap);
});
document.querySelector("#radioSatelit").addEventListener("change", function () {
    map.getLayers().setAt(0, satelitBaseMap);
});
document.querySelector("#radioTopo").addEventListener("change", function () {
    map.getLayers().setAt(0, topoMap);
});
document.querySelector("#radioHiker").addEventListener("change", function () {
    map.getLayers().setAt(0, hikerMap);
});


/***** PRETRAGA LEJERA */
document.querySelector("#ddlLejerPretraga").addEventListener("change", function () {
    prikaziDivPretraga(this.value);
});

function prikaziDivPretraga(ddlValue) {
    sakrijSveDivPretrage();
    if (ddlValue === "drvece") {
        document.querySelector("#divDrvece").style.display = "block";
        document.querySelector("#chkDrvece").checked = true;
        drvece.setVisible(true);
    }
    if (ddlValue === "zbunjeLinija") {
        document.querySelector("#divZbunjeLinija").style.display = "block";
        document.querySelector("#chkZbunjeLinija").checked = true;
        zbunjeLinija.setVisible(true);
    }
    if (ddlValue === "zbunjeTacka") {
        document.querySelector("#divZbunjeTacka").style.display = "block";
        document.querySelector("#chkZbunjeTacka").checked = true;
        zbunjeTacka.setVisible(true);
    }
    if (ddlValue === "zelenePovrsine") {
        document.querySelector("#divZelenePovrsine").style.display = "block";
        document.querySelector("#chkZelenePovrsine").checked = true;
        zelenePovrsine.setVisible(true);
    }
    if (ddlValue === "urbaniMobilijar") {
        document.querySelector("#divUrbaniMobilijar").style.display = "block";
        document.querySelector("#chkUrbaniMobilijar").checked = true;
        urbaniMobilijar.setVisible(true);
    }
    if (ddlValue === "rekreativnePovrsine") {
        document.querySelector("#divRekreativnePovrsine").style.display = "block";
        document.querySelector("#chkRekreativnePovrsine").checked = true;
        rekreativnePovrsine.setVisible(true);
    }
}

function sakrijSveDivPretrage() {
    document.querySelector("#divDrvece").style.display = "none";
    document.querySelector("#divZbunjeLinija").style.display = "none";
    document.querySelector("#divZbunjeTacka").style.display = "none";
    document.querySelector("#divZelenePovrsine").style.display = "none";
    document.querySelector("#divUrbaniMobilijar").style.display = "none";
    document.querySelector("#divRekreativnePovrsine").style.display = "none";
}


/*** FILTRIRANJE */

/**Povezivanje kontrola koje zavise od lejera sa akcijama */
document.querySelector("#btnFilter").addEventListener("click", filtriranje);

function filtriranje() {
    let ddlValue = document.querySelector("#ddlLejerPretraga").value,
        prostorniFilter = "",
        atributniFilter = "";
    prostorniFilter = kreiranjeCqlFilteraProstorno();
    //Atributi se pretražuju samo ako je odabran lejer. Za sve lejere se radi samo prostorna selekcija
    (ddlValue !== "") && (atributniFilter = kreiranjeCqlFilteraAtributiZaJavnuStranicu(ddlValue));
    if (prostorniFilter !== "" && atributniFilter !== "") {
        cqlFilter = "(" + prostorniFilter + ") AND " + atributniFilter;
    } else {
        cqlFilter = prostorniFilter + atributniFilter;
    }
    if (cqlFilter === "") {
        //return false;
        cqlFilter = "INCLUDE";
    }

    if (ddlValue === "") {
        //TODO filter svih prikazanih lejera - dodao da se resetuje svaki put - tri reda iznad
        map.getLayers().forEach(function (layer) {
            if (layer instanceof ol.layer.Image) {
                if (layer.get("visible")) {
                    let params = layer.getSource().getParams();
                    params.CQL_FILTER = cqlFilter;
                    layer.getSource().updateParams(params);
                }
            }

        });

    } else {
        if (ddlValue === "drvece") {
            let params = drvece.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            drvece.getSource().updateParams(params);
        }
        if (ddlValue === "zbunjeLinija") {
            let params = zbunjeLinija.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            zbunjeLinija.getSource().updateParams(params);
        }
        if (ddlValue === "zbunjeTacka") {
            let params = zbunjeTacka.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            zbunjeTacka.getSource().updateParams(params);
        }
        if (ddlValue === "zelenePovrsine") {
            let params = zelenePovrsine.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            zelenePovrsine.getSource().updateParams(params);
        }
        if (ddlValue === "urbaniMobilijar") {
            let params = urbaniMobilijar.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            urbaniMobilijar.getSource().updateParams(params);
        }
        if (ddlValue === "rekreativnePovrsine") {
            let params = rekreativnePovrsine.getSource().getParams();
            params.CQL_FILTER = cqlFilter;
            rekreativnePovrsine.getSource().updateParams(params);
        }
    }
}

/** Filtriranje po atributima */
function kreiranjeCqlFilteraAtributiZaJavnuStranicu(ddlValue) {
    let retVal = "";

    if (ddlValue === "drvece") {
        document.querySelector("#pretragaIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaIdObjekta").value + " AND ");
        document.querySelector("#pretragaLatinskiNaziv").value !== "" && (retVal += "latinski_naziv ILIKE '%" + document.querySelector("#pretragaLatinskiNaziv").value + "%' AND ");
        document.querySelector("#pretragaNarodniNaziv").value !== "" && (retVal += "narodni_naziv ILIKE '%" + document.querySelector("#pretragaNarodniNaziv").value + "%' AND ");
        document.querySelector("#pretragaFitopatoloskePromjene").value !== "" && (retVal += "fitopatoloske_promjene ILIKE '%" + document.querySelector("#pretragaFitopatoloskePromjene").value + "%' AND ");
        document.querySelector("#pretragaVrstaFitopatoloskePromjene").value !== "" && (retVal += "vrsta_fitopatoloske_promjene ILIKE '%" + document.querySelector("#pretragaVrstaFitopatoloskePromjene").value + "%' AND ");
        document.querySelector("#pretragaEntomoloskePromjene").value !== "" && (retVal += "entomoloske_promjene ILIKE '%" + document.querySelector("#pretragaEntomoloskePromjene").value + "%' AND ");
        document.querySelector("#pretragaVrstaEntomoloskePromjene").value !== "" && (retVal += "vrsta_entomoloske_promjene ILIKE '%" + document.querySelector("#pretragaVrstaEntomoloskePromjene").value + "%' AND ");
        document.querySelector("#pretragaTipKragne").value !== "" && (retVal += "tip_kragne ILIKE '%" + document.querySelector("#pretragaTipKragne").value + "%' AND ");
        document.querySelector("#pretragaVrijemeSadnje").value !== "" && (retVal += "vrijeme_sadnje ILIKE '%" + document.querySelector("#pretragaVrijemeSadnje").value + "%' AND ");
        document.querySelector("#pretragaNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaNapomena").value + "%' AND ");
        document.querySelector("#pretragaOstaliDetalji").value !== "" && (retVal += "ostali_detalji ILIKE '%" + document.querySelector("#pretragaOstaliDetalji").value + "%' AND ");
        document.querySelector("#pretragaTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaTip").value + "' AND ");
        document.querySelector("#pretragaIzrazenostOtvoreneTruleziDebla").value !== "" && (retVal += "izrazenost_otvorene_trulezi_debla = '" + document.querySelector("#pretragaIzrazenostOtvoreneTruleziDebla").value + "' AND ");
        document.querySelector("#pretragaVelicinaOtvoreneTruleziDebla").value !== "" && (retVal += "velicina_otvorene_trulezi_debla = '" + document.querySelector("#pretragaVelicinaOtvoreneTruleziDebla").value + "' AND ");
        document.querySelector("#pretragaIzrazenostOtvoreneTruleziGrana").value !== "" && (retVal += "izrazenost_otvorene_trulezi_grana = '" + document.querySelector("#pretragaIzrazenostOtvoreneTruleziGrana").value + "' AND ");
        document.querySelector("#pretragaVelicinaOtvoreneTruleziGrana").value !== "" && (retVal += "velicina_otvorene_trulezi_grana = '" + document.querySelector("#pretragaVelicinaOtvoreneTruleziGrana").value + "' AND ");
        document.querySelector("#pretragaOcjenaVitalnosti").value !== "" && (retVal += "ocjena_vitalnosti = '" + document.querySelector("#pretragaOcjenaVitalnosti").value + "' AND ");
        document.querySelector("#pretragaOcjenaDekorativnosti").value !== "" && (retVal += "ocjena_dekorativnosti = '" + document.querySelector("#pretragaOcjenaDekorativnosti").value + "' AND ");
        document.querySelector("#pretragaOpsegStarosti").value !== "" && (retVal += "opseg_starosti = '" + document.querySelector("#pretragaOpsegStarosti").value + "' AND ");
        document.querySelector("#pretragaSlomljeneGrane").value !== "" && (retVal += "slomljene_grane = '" + document.querySelector("#pretragaSlomljeneGrane").value + "' AND ");
        document.querySelector("#pretragaSuveGrane").value !== "" && (retVal += "suve_grane = '" + document.querySelector("#pretragaSuveGrane").value + "' AND ");
        document.querySelector("#pretragaSuhovrhost").value !== "" && (retVal += "suhovrhost = '" + document.querySelector("#pretragaSuhovrhost").value + "' AND ");
        document.querySelector("#pretragaKvalitet").value !== "" && (retVal += "kvalitet = '" + document.querySelector("#pretragaKvalitet").value + "' AND ");
        document.querySelector("#pretragaVisinaStablaOd").value !== "" && (retVal += "visina_stabla >= " + document.querySelector("#pretragaVisinaStablaOd").value + " AND ");
        document.querySelector("#pretragaVisinaStablaDo").value !== "" && (retVal += "visina_stabla <= " + document.querySelector("#pretragaVisinaStablaDo").value + " AND ");
        document.querySelector("#pretragaVisinaDeblaOd").value !== "" && (retVal += "visina_debla >= " + document.querySelector("#pretragaVisinaDeblaOd").value + " AND ");
        document.querySelector("#pretragaVisinaDeblaDo").value !== "" && (retVal += "visina_debla <= " + document.querySelector("#pretragaVisinaDeblaDo").value + " AND ");
        document.querySelector("#pretragaPrsniPrecnikOd").value !== "" && (retVal += "prsni_precnik >= " + document.querySelector("#pretragaPrsniPrecnikOd").value * Math.PI + " AND ");
        document.querySelector("#pretragaPrsniPrecnikDo").value !== "" && (retVal += "prsni_precnik <= " + document.querySelector("#pretragaPrsniPrecnikDo").value * Math.PI + " AND ");
        document.querySelector("#pretragaSirinaKrosnjeOd").value !== "" && (retVal += "sirina_krosnje >= " + document.querySelector("#pretragaSirinaKrosnjeOd").value + " AND ");
        document.querySelector("#pretragaSirinaKrosnjeDo").value !== "" && (retVal += "sirina_krosnje <= " + document.querySelector("#pretragaSirinaKrosnjeDo").value + " AND ");
        document.querySelector("#pretragaOcekivanoTrajanjeZivotaOd").value !== "" && (retVal += "ocekivano_trajanje_zivota >= " + document.querySelector("#pretragaOcekivanoTrajanjeZivotaOd").value + " AND ");
        document.querySelector("#pretragaOcekivanoTrajanjeZivotaDo").value !== "" && (retVal += "ocekivano_trajanje_zivota <= " + document.querySelector("#pretragaOcekivanoTrajanjeZivotaDo").value + " AND ");
        document.querySelector("#pretragaCijenaSadniceOd").value !== "" && (retVal += "cijena_sadnice >= " + document.querySelector("#pretragaCijenaSadniceOd").value + " AND ");
        document.querySelector("#pretragaCijenaSadniceDo").value !== "" && (retVal += "cijena_sadnice <= " + document.querySelector("#pretragaCijenaSadniceDo").value + " AND ");
        document.querySelector("#pretragaIsjeceneDebeleGrane").value !== "" && (retVal += "isjecene_debele_grane = " + document.querySelector("#pretragaIsjeceneDebeleGrane").value + " AND ");
        document.querySelector("#pretragaPremazivanjeNakonSjece").value !== "" && (retVal += "premazivanje_nakon_sjece = " + document.querySelector("#pretragaPremazivanjeNakonSjece").value + " AND ");
        document.querySelector("#pretragaIsjecenoUklonjenoStablo").value !== "" && (retVal += "isjeceno_uklonjeno_stablo = " + document.querySelector("#pretragaIsjecenoUklonjenoStablo").value + " AND ");
        document.querySelector("#pretragaPripadnostDrvoredu").value !== "" && (retVal += "pripadnost_drvoredu = " + document.querySelector("#pretragaPripadnostDrvoredu").value + " AND ");
    }
    if (ddlValue === "zbunjeLinija") {
        document.querySelector("#pretragaZLIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaZLIdObjekta").value + " AND ");
        document.querySelector("#pretragaZLLatinskiNaziv").value !== "" && (retVal += "latinski_naziv ILIKE '%" + document.querySelector("#pretragaZLLatinskiNaziv").value + "%' AND ");
        document.querySelector("#pretragaZLNarodniNaziv").value !== "" && (retVal += "narodni_naziv ILIKE '%" + document.querySelector("#pretragaZLNarodniNaziv").value + "%' AND ");
        document.querySelector("#pretragaZLTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaZLTip").value + "' AND ");
        document.querySelector("#pretragaZLZdravstvenoStanje").value !== "" && (retVal += "zdravstveno_stanje = '" + document.querySelector("#pretragaZLZdravstvenoStanje").value + "' AND ");
        document.querySelector("#pretragaZLNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaZLNapomena").value + "%' AND ");
    }
    if (ddlValue === "zbunjeTacka") {
        document.querySelector("#pretragaZTIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaZTIdObjekta").value + " AND ");
        document.querySelector("#pretragaZTLatinskiNaziv").value !== "" && (retVal += "latinski_naziv ILIKE '%" + document.querySelector("#pretragaZTLatinskiNaziv").value + "%' AND ");
        document.querySelector("#pretragaZTNarodniNaziv").value !== "" && (retVal += "narodni_naziv ILIKE '%" + document.querySelector("#pretragaZTNarodniNaziv").value + "%' AND ");
        document.querySelector("#pretragaZTTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaZTTip").value + "' AND ");
        document.querySelector("#pretragaZTZdravstvenoStanje").value !== "" && (retVal += "zdravstveno_stanje = '" + document.querySelector("#pretragaZTZdravstvenoStanje").value + "' AND ");
        document.querySelector("#pretragaZTNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaZTNapomena").value + "%' AND ");
    }
    if (ddlValue === "zelenePovrsine") {
        document.querySelector("#pretragaZPIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaZPIdObjekta").value + " AND ");
        document.querySelector("#pretragaZPNamjena").value !== "" && (retVal += "namjena ILIKE '%" + document.querySelector("#pretragaZPNamjena").value + "%' AND ");
        document.querySelector("#pretragaZPOpis").value !== "" && (retVal += "opis ILIKE '%" + document.querySelector("#pretragaZPOpis").value + "%' AND ");
        document.querySelector("#pretragaZPTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaZPTip").value + "' AND ");
    }
    if (ddlValue === "urbaniMobilijar") {
        document.querySelector("#pretragaUMIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaUMIdObjekta").value + " AND ");
        document.querySelector("#pretragaUMMaterijal").value !== "" && (retVal += "materijal ILIKE '%" + document.querySelector("#pretragaUMMaterijal").value + "%' AND ");
        document.querySelector("#pretragaUMBoja").value !== "" && (retVal += "boja ILIKE '%" + document.querySelector("#pretragaUMBoja").value + "%' AND ");
        document.querySelector("#pretragaUMTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaUMTip").value + "' AND ");
        document.querySelector("#pretragaUMStanje").value !== "" && (retVal += "stanje = '" + document.querySelector("#pretragaUMStanje").value + "' AND ");
        document.querySelector("#pretragaUMNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaUMNapomena").value + "%' AND ");
    }
    if (ddlValue === "rekreativnePovrsine") {
        document.querySelector("#pretragaRPIdObjekta").value !== "" && (retVal += "id = " + document.querySelector("#pretragaRPIdObjekta").value + " AND ");
        document.querySelector("#pretragaRPDimenzije").value !== "" && (retVal += "dimenzije ILIKE '%" + document.querySelector("#pretragaRPDimenzije").value + "%' AND ");
        document.querySelector("#pretragaRPMaterijal").value !== "" && (retVal += "materijal ILIKE '%" + document.querySelector("#pretragaRPMaterijal").value + "%' AND ");
        document.querySelector("#pretragaRPBoja").value !== "" && (retVal += "boja ILIKE '%" + document.querySelector("#pretragaRPBoja").value + "%' AND ");
        document.querySelector("#pretragaRPTip").value !== "" && (retVal += "tip = '" + document.querySelector("#pretragaRPTip").value + "' AND ");
        document.querySelector("#pretragaRPStanje").value !== "" && (retVal += "stanje = '" + document.querySelector("#pretragaRPStanje").value + "' AND ");
        document.querySelector("#pretragaRPNapomena").value !== "" && (retVal += "napomena ILIKE '%" + document.querySelector("#pretragaRPNapomena").value + "%' AND ");
    }

    retVal.length > 5 && (retVal = retVal.substring(0, retVal.length - 5));
    return retVal;
}