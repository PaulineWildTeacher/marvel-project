import { useEffect, useState } from 'react'
import './App.css'
import md5 from 'md5';
import { Character } from './components/Character';

const PUBLIC_KEY = '665e207ff09b7ef028f0c7273dd403bf';
const PRIVATE_KEY = '3355f12b47d7581ff3eeec3ff5faa1407d009288';
const API_URL = 'https://gateway.marvel.com:443/v1/public/characters';
const RESULTS_PER_PAGE = 20; // nombre de résultats par page

const generateHash = (offset = 0) => {
  const timestamp = new Date().getTime();
  const hash = md5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`);

  return `ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=${RESULTS_PER_PAGE}&offset=${offset}`;
}

function App() {
  const [url, setUrl] = useState(`${API_URL}?${generateHash()}`);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0); //state pour gérer le changement de page
  const [searchCharacter, setSearchCharacter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        setCharacters(result.data.results);
      })
      .catch((error) => {
        throw new Error(`Une erreur est survenue lors du chargement de vos résultats : ${error}`)
      })
  }, [url]);

  useEffect(() => {
    if(searchCharacter) {
      setUrl(`${API_URL}?nameStartsWith=${searchCharacter}&${generateHash(0)}`);
    }
    setUrl(`${API_URL}?${generateHash(offset)}`);
  }, [offset, searchCharacter])

  const loadNext = () => {
    setOffset(offset + RESULTS_PER_PAGE);
  }

  const loadPrevious = () => {
    if (offset >= RESULTS_PER_PAGE) {
      setOffset(offset - RESULTS_PER_PAGE);
    }
  } 

  const handleSearch = (event) => {
    setSearchCharacter(event.target.value);
  }

  const searchMarvelCharacter = () => {
    if (searchCharacter) {
      setOffset(0);
    } 
  }

  return (
    <div className='main-container'>
      <div className="search-bar-container">
        <input type='search' className='search-bar' placeholder='Search your hero'
        onChange={(event) => handleSearch(event)}
        value={searchCharacter} 
        onKeyDown={searchMarvelCharacter}/>
      </div>

      {loading ? (
        <h1>Chargement en cours ...</h1>
      ) : (
        characters && (
          <>
            <div className='main-character-container'>
              {characters.map((character)=>(
                <Character key={character.id} characterInfo={character}/>
              ))}
            </div>

            <div className="button-container">
              <button onClick={loadPrevious} disabled={offset === 0}>Previous</button>
              <button onClick={loadNext}>Next</button>
            </div>
          </>
        )
      )}
    </div>
  )
}

export default App
