import React from 'react'
import { Navbar, Header } from '../common';



import { useState, useEffect } from "react";

const doSearchQuery = (maa) => {
    let r = [];
    if (maa != "") r.push("maa=" + maa);

    // laitetaan AINA query-muuttujaan kellonaika millisekunteina (1.1.1970 lähtien)
    // näin joka kerta query:n sisältö on vähän erilainen kun painetaan Hae-nappia
    // REST-api ei välitä ylim. query-muuttujasta
    r.push(Date.now());

    return r.join("&");
};

export const Asiakas = () => {

    const [kohdenimi, setKohdeNimi] = useState("");
    const [osoite, setOsoite] = useState("");
    const [maa, setMaa] = useState("");
    const [paikkakunta, setPaikkakunta] = useState("");
    const [kuvaus, setKuvaus] = useState("");
    const [query, setQuery] = useState("");
    const [kohteet, setKohteet] = useState([]);
    const [kohdedeleted, setKohdeDeleted] = useState(null);
    const [kohdeinserted, setKohdeInserted] = useState(null);
    const [kohdemodified, setKohdeModified] = useState(null);
    const [modifiedKohde, setModifiedKohde] = useState(null);
    const [showEditForm, setshowEditForm] = useState(false);
    const [muutettavaid, setMuutettavaId] = useState(-1);

    useEffect(() => {
        const fetchKohde = async () => {
            const response = await fetch("http://localhost:3004/matkakohde?" + query);
            const data = await response.json();
            setKohteet(data);
        }
        if (query != "") fetchKohde();
    }, [query])

    useEffect(() => {
        const fetchAsiakasById = async () => {
            const r = await fetch("http://localhost:3004/matkakohde/" + muutettavaid);
            const data = await r.json();
            // Huomaa että tämä palvelu palauttaa VAIN yhden object:n
            // jos haet niin että url on muotoa http://localhost:3004/asiakas?id=200 -> palautuu TAULUKKO -> ota taulukon 1. alkio
            setKohdeModified(data);
            setshowEditForm(true);
        };
        if (muutettavaid > 0) fetchAsiakasById();
    }, [muutettavaid]);

    useEffect(() => {
        const deleteKohde = async () => {
            const r = await fetch(
                "http://localhost:3004/matkakohde/" + kohdedeleted.id,
                {
                    method: "DELETE",
                }
            );
            console.log("DELETE:", r);
            setQuery(doSearchQuery(maa));
        };
        if (kohdedeleted != null) deleteKohde();
    }, [kohdedeleted]);

    useEffect(() => {
        const insertKohde = async () => {
            const r = await fetch("http://localhost:3004/matkakohde/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    kohdenimi: kohdeinserted.kohdenimi,
                    maa: kohdeinserted.maa,
                    paikkakunta: kohdeinserted.paikkakunta,
                    kuvaus: kohdeinserted.kuvaus,
                }),
            });
            console.log("INSERT:", r);
            setQuery(doSearchQuery(maa));
            setKohdeInserted(null);
        };
        if (kohdeinserted != null) insertKohde();
    }, [kohdeinserted]);

    useEffect(() => {
        const modifyKohde = async () => {
            const r = await fetch(
                "http://localhost:3004/matkakohde/" + modifiedKohde.id,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        kohdenimi: modifiedKohde.nimi,
                        maa: modifiedKohde.maa,
                        paikkakunta: modifiedKohde.paikkakunta,
                        kuvaus: modifiedKohde.kuvaus,
                    }),
                }
            );
            console.log("MODIFY:", r);
            setQuery(doSearchQuery(maa));
            setModifiedKohde(null);
            setKohdeModified(null);
        };
        if (modifiedKohde != null) modifyKohde();
    }, [modifiedKohde]);


    const haeClicked = () => {
        setQuery(doSearchQuery(maa));
    };

    const onDelete = (matkakohde) => {
        setKohdeDeleted(matkakohde);
    };

    const onEdit = (matkakohde) => {
        setMuutettavaId(matkakohde.id);
        setshowEditForm(true);
    };

    const renderTable = () => {
        return <Kohteet data={kohteet} onDelete={onDelete} onEdit={onEdit} />;

    };
    const onCancel = () => {
        setshowEditForm(false);
        setKohdeModified(null);
    };

    const onSave = (newKohde) => {
        if (newKohde.id > 0) setModifiedKohde(newKohde);
        else setKohdeInserted(newKohde);
        setshowEditForm(false);
    };

    return ( <div>
    {showEditForm ? (
      <KohdeForm
        onSave={onSave}
        onCancel={onCancel}
        matkakohde={kohdemodified}
      />
    ) : (
      <div>
        <label>
          Maa: 
          <input
            type="text"
            value={maa}
            onChange={(e) => setMaa(e.target.value)}
          />
        </label>
        
        <button onClick={() => haeClicked()}>
          Hae
        </button>
        <button onClick={() => setshowEditForm(true)}>
          Lisää uusi
        </button>

        <h4>KOHTEET</h4>
        {renderTable()}
      </div>
    )}
  </div>
  );
}
const KohdeForm = (props) => {
    const { onCancel, onSave, matkakohde } = props;
  
    const [kohdenimi, setKohdeNimi] = useState("");
    const [maa, setMaa] = useState("");
    const [paikkakunta, setPaikkakunta] = useState("");
    const [kuvaus, setKuvaus] = useState("");
    
  
    const tallennaClicked = () => {
      onSave({id: -1, maa, kohdenimi, paikkakunta, kuvaus });
    };
  
    useEffect(() => {
      if (matkakohde) {
        setKohdeNimi(matkakohde.kohdenimi);
        setMaa(matkakohde.maa);
        setPaikkakunta(matkakohde.paikkakunta);
        setKuvaus(matkakohde.kuvaus);
      }
    }, [matkakohde]);
  
    //console.log("Asiakasform:", asiakas);
  
    return (
      <div>
        {matkakohde ? (
          <h4>Matkakohteen muokkaaminen</h4>
        ) : (
          <h4>Uuden matkakohteen lisääminen</h4>
        )}
        <label>
          Kohde nimi:
          <input
            type="text"
            value={kohdenimi}
            onChange={(e) => setKohdeNimi(e.target.value)}
          />
        </label>
        <label>
          Kohde maa: 
          <input
            type="text"
            value={maa}
            onChange={(e) => setMaa(e.target.value)}
          />
        </label>
        <label>
          Paikkakunta:
          <input
            type="text"
            value={paikkakunta}
            onChange={(e) => setPaikkakunta(e.target.value)}
          />
        </label>
        <label>
          Kuvaus:
          <input
          type="text"
            value={kuvaus}
            onChange={(e) => setKuvaus(e.target.value)}
          />
            
          
        </label>
        {matkakohde ? (
          <button onClick={() => tallennaClicked()}>
            Tallenna muutos
          </button>
        ) : (
          <button onClick={() => tallennaClicked()}>
            Tallenna
          </button>
        )}
        {matkakohde ? (
          <button  onClick={() => onCancel()}>
            Peruuta Muutos
          </button>
        ) : (
          <button  onClick={() => onCancel()}>
            Peruuta
          </button>
        )}
      </div>
    );
  };
const Kohteet = (props) => {
    console.log("kohteet: ", props)
    const { data , onDelete, onEdit} = props;

    const rows = data.map((t) => (
        <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.kohdenimi}</td>
            <td>{t.maa}</td>
            <td>{t.paikkakunta}</td>
            <td>{t.kuvaus}</td>
            <td>
            <button onClick={() => deleteClicked(t)}>
          Poista {t.id}
        </button>
      </td>
      <td>
        <button  onClick={() => onEdit(t)}>
          Muokkaa asiakasta {t.id}
        </button>
      </td>
    </tr>
    ))

    const deleteClicked = (a) => {
        //Kommentoitu tehtävän 23 testitarkoistua varten
        //Muuta tehtävää ja tehtävänantoa niin että table häviää ja tilalle tulee varmistus
        const r = window.confirm(`Haluatko varmasti poistaa kohteen ${a.kohdenimi} maasta ${a.maa}?`);
        console.log("ärrä: ")
        if (r) onDelete(a);
      };

    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <td>Id</td>
                        <td>Kohde</td>
                        <td>Maa</td>
                        <td>Paikkakunta</td>
                        <td>Kuvaus</td>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
}
export default Asiakas;