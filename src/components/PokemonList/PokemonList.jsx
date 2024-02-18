import { useEffect, useState } from "react";
import axios from "axios";
import "./pokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

  const [pokemonlist, setPokemonList] = useState([]);
  const [isLoading, setUseLoading] = useState(true);
  const [pokedexURL, setPokedexURL] = useState("https://pokeapi.co/api/v2/pokemon")
  const[nextURL,setNextURL] = useState("")
  const [prevURL,setPrevURL]=useState("")



  async function downloadPokemons() {
    setUseLoading(true)
    const response = await axios.get(pokedexURL);
    const pokemonResults = response.data.results;
    console.log(response.data)
    setNextURL(response.data.next)
    setPrevURL(response.data.previous)


    const pokemonResultPromise = pokemonResults.map((pokemon) =>
      axios.get(pokemon.url)
    );
    const pokemonData = await axios.all(pokemonResultPromise);
    console.log(pokemonData);

    const res = pokemonData.map((pokeData) => {
      const pokemon = pokeData.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other
          ? pokemon.sprites.other.dream_world.front_default
          : pokemon.sprites.front_shiny,
        types: pokemon.types,
      };
    });
    console.log(res);
    setPokemonList(res);
    setUseLoading(false);
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokedexURL]);

  return (
    <>
      <div className="pokemon-list-wrapper">
        <div>Pokemon List</div>
        <div className="pokemon-wrapper">
          {isLoading
            ? "Loading....."
            : pokemonlist.map((p) => (
                <Pokemon name={p.name} image={p.image} key={p.id} />
              ))}
        </div>
        <div className="controlls">
          <button disabled={prevURL==undefined} onClick={()=>setPokedexURL(prevURL)}>Prev</button>
          <button disabled={nextURL==undefined} onClick={()=>setPokedexURL(nextURL)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default PokemonList;
