import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity, TextStyle, ViewStyle, ImageStyle } from 'react-native';

const MOVIES_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json";

const IMAGE_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/public/images/";

interface ISortButtonStyles
{
  buttonWrapper: ViewStyle,
  button: ViewStyle,
  text : TextStyle
}

interface IFlatListStyles
{
  outerDiv: ViewStyle,
  innerDiv: ViewStyle,
  movieTitleHeader: TextStyle,
  movieEpisodeNumber: TextStyle,
  episodeText: TextStyle,
  image : ImageStyle
}

const sortButtonStyles = StyleSheet.create<ISortButtonStyles>(
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
      fontSize: 30,
      margin: "auto",
      padding: "0px"
    }
  }
);

const FlatListStyles = StyleSheet.create<IFlatListStyles>(
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
      fontSize: 40
    },
    movieEpisodeNumber: {
      color: "#EFF6EE",
      margin: "0px",
      textAlign: "center",
      fontSize: 30
    },
    episodeText: {
      fontSize: 30
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
    <MovieApplication />
  );
}

type MovieJSONData = {
  movies: Array<MovieJSON>
}

type MovieJSON = {
  title: string,
  description: string,
  episode_number: string,
  hero_image: string,
  main_characters: Array<string>,
  poster: string,
}

export const MovieApplication = () => {
  const [movieArray, setMovieArray] = useState(new Array<MovieJSON>());

  const [buttonState, setButtonState] = useState(true);

  const Sort = {
    ASCENDING: 1,
    DESCENDING: -1
  } as const;

  const loadMoviesToMovieList = () =>
  {
    fetch(MOVIES_URL).then((movieReqResponse) => {
      movieReqResponse.json().then((movieJsonData: MovieJSONData) => {
        setMovieArray(movieJsonData.movies);
      })
    });
  }

  const sortMovieArray = (sortType: 1 | -1) =>
  {
    const movieArrayClone = movieArray.slice();
    movieArrayClone.sort(
      (movieA, movieB) =>
      {
        return (movieA.title.localeCompare(movieB.title) * sortType);
      }
    );
    setMovieArray(movieArrayClone);
  }

  const onSortButtonClick = () => {
    setButtonState(!buttonState);
  }

  useEffect( () => {
    loadMoviesToMovieList();
  }, []);

  useEffect( () => {
    var sortType = buttonState ? Sort.ASCENDING : Sort.DESCENDING;
    sortMovieArray(sortType);
  }, [buttonState]);

  return (
    <View>
      <FlatList data={movieArray} renderItem={function(item : {item: MovieJSON})
      {
        var movieImagePath = (IMAGE_URL + item.item.poster);

        return (
          <View style={FlatListStyles.outerDiv}>
            <View style={FlatListStyles.innerDiv}>
              <Text style={FlatListStyles.movieTitleHeader}>{item.item.title}</Text>
              <Text style={FlatListStyles.movieEpisodeNumber}>{"Episode Number: " + item.item.episode_number}</Text>
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

