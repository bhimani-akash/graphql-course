import React, { useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");

  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);

  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  if (loading) {
    return <h1>Data is loading...</h1>;
  }
  if (error) {
    console.log(error);
  }
  if (movieError) {
    console.log(movieError);
  }

  return (
    <div>
      <h1>
        <u>List of Users</u>
      </h1>
      {data &&
        data.users.map((user) => {
          return (
            <div>
              <h2>Name: {user.name}</h2>
              <h2>Username: {user.username}</h2>
              <h2>Age: {user.age}</h2>
              <p>Nationality: {user.nationality}</p>
              <hr />
            </div>
          );
        })}

      <h1>
        <u>List of Movies</u>
      </h1>
      {movieData &&
        movieData.movies.map((movie) => {
          return <h2>Movie Name: {movie.name}</h2>;
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <h1>MovieName: {movieSearchedData.movie.name}</h1>
              <h1>
                Year of Publication: {movieSearchedData.movie.yearOfPublication}
              </h1>
            </div>
          )}
          {movieError && <p>There was an error fetching data</p>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;