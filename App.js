import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const MOVIES_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json";

const IMAGE_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/public/images/";

const MOVIE_TITLE_KEY = "title";
const MOVIE_EPISODE_NUM_KEY = "episode_number";
const MOVIE_IMAGE_KEY = "poster";

const sortButtonStyles = StyleSheet.create(
  {
    buttonWrapper:
    {
      width: "100%",
      height: "300px",
      backgroundColor: "#273043"
    },
    button:
    {
      width: "500px",
      margin: "auto",
      height: "100px",
      backgroundColor: "#9197AE"
    },
    text:
    {
      color: "#EFF6EE",
      textAlign: "center",
      fontSize: "30px",
      margin: "auto",
      padding: "0px"
    }
  }
);

const FlatListStyles = StyleSheet.create(
  {
    outerDiv: {
      backgroundColor: "#F02D3A",
      width: "100%",
      height: "auto"
    },
    innerDiv: {
      width: "80%",
      height: "600px",

      marginTop: "5px",
      marginBottom: "5px",

      marginLeft: "auto",
      marginRight: "auto",

      backgroundColor: "#273043"
    },
    movieTitleHeader: {
      color: "#EFF6EE",
      margin: "0px",
      textAlign: "center",
      fontSize: "40px"
    },
    movieEpisodeNumber: {
      color: "#EFF6EE",
      margin: "0px",
      textAlign: "center",
      fontSize: "30px"
    },
    episodeText: {
      fontSize: "30px"
    },
    image: {
      width: "40%",
      height: "450px",
      marginLeft: "auto",
      marginRight: "auto",
      resizeMode: 'contain'
    },
  }
);

export default function App() {
  return (
    <MovieApplication></MovieApplication>
  );
}

export function MovieApplication()
{
  const loadMoviesToMovieList = (setMovieArray) =>
  {
    fetch(MOVIES_URL).then((movieReqResponse) => {
      movieReqResponse.json().then((movieJsonData) =>
        {
          setMovieArray(movieJsonData.movies);
        }
      )
    });
  }

  const Sort = {
    ASCENDING : 1,
    DESCENDING: -1
  }
  
  const sortMovieArray = (sortType) =>
  {
    const movieArrayClone = movieArray.slice();
    movieArrayClone.sort(
      (movieA, movieB) =>
      {
        return (movieA[MOVIE_TITLE_KEY].localeCompare(movieB[MOVIE_TITLE_KEY]) * sortType);
      }
    );
    setMovieArray(movieArrayClone);
  }

  const onSortButtonClick = () => {
    setButtonState(!buttonState);
  }

  const [movieArray, setMovieArray] = useState([]);

  const [buttonState, setButtonState] = useState(true);

  useEffect( () => {
    loadMoviesToMovieList(setMovieArray);
  }, []);

  useEffect( () => {
    var sortType = buttonState ? Sort.ASCENDING : Sort.DESCENDING;
    sortMovieArray(sortType);
  }, [buttonState]);

  return (
    <View>
      <FlatList data={movieArray} renderItem={function(item, index, separators)
      {
        var movieImagePath = (IMAGE_URL + item.item[MOVIE_IMAGE_KEY]);

        return (
          <View style={FlatListStyles.outerDiv}>
            <View style={FlatListStyles.innerDiv}>
              <Text style={FlatListStyles.movieTitleHeader}>{item.item[MOVIE_TITLE_KEY]}</Text>
              <Text style={FlatListStyles.movieEpisodeNumber}>{"Episode Number: " + item.item[MOVIE_EPISODE_NUM_KEY]}</Text>
              <Image style={FlatListStyles.image} source={{uri: `${movieImagePath}`}}/>
            </View>
          </View>
        );
      }}></FlatList>

      <View style={sortButtonStyles.buttonWrapper}>
        <TouchableOpacity style={sortButtonStyles.button} onPress={onSortButtonClick}>
          <Text style={sortButtonStyles.text}>SORT MOVIES - {buttonState ? "Descending" : "Ascending"}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


