import styles from "./page.module.css";
import { AppContext } from "./AppContext";
import { use, useContext } from "react";
import { AppContextProvider } from "./AppContext";
import { useState, useEffect, useRef } from "react";
type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};
export default function PruebaSearch() {
  const { albumsPlaylist, albumsPlaylistDispatch, albumsPL } =
    useContext(AppContext);

  const [results, setResults] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  let debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      fetchData();
    }, 300);
    
    function fetchData() {
      console.log("disparo", searchTerm);
      try {
        fetch("/api/prueba/" + searchTerm)
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }, [searchTerm]);

  function handlePruebaSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  return (
    <div>
      <h2>prueba search</h2>
      <input
        type="text"
        placeholder="Search"
        onChange={handlePruebaSearch}
        value={searchTerm}
      />
      <div style={{ height: "200px", overflow: "auto" }} className={""}>
        {results &&
          results.length > 0 &&
          results.map((img: { id: string; url: string }, index: number) => (
            <div className={styles.albumsItem} key={img.id + index.toString()}>
              {img.id}
              {img.url}{" "}
            </div>
          ))}
      </div>
    </div>
  );
}
/*
import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "./AppContext";

const PruebaSearch = () => {
  useContext(AppContext);

  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Estado para la paginación

  let debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchData(1); // Reiniciar a la primera página en cada búsqueda nueva
    }, 300);

    function fetchData(page: number) {
      console.log("disparo", searchTerm);
      try {
        fetch(`/api/prueba/${searchTerm}?page=${page}`)
          .then((res) => res.json())
          .then((data) => {
            if (page === 1) {
              setResults(data);
            } else {
              setResults((prevResults) => [...prevResults, ...data]);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      setPage((prevPage) => prevPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchData(page);
    }
  }, [page]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default PruebaSearch;
*/