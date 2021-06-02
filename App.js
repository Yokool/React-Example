import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const MOVIES_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json";

const IMAGE_URL = "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/public/images/";

const MOVIE_TITLE_KEY = "title";
const MOVIE_EPISODE_NUM_KEY = "episode_number";
const MOVIE_IMAGE_KEY = "poster";

export default function App() {
  return (
    <MovieApplication></MovieApplication>
  );
}

export function MovieApplication()
{
  

  const loadMoviesToMovieList = (setMovieArray) =>
  {
    var moviesURLRequest = new XMLHttpRequest();
    moviesURLRequest.addEventListener("loadend", function() {
      onMoviesLoaded(this.responseText, setMovieArray);
    });
    moviesURLRequest.open("GET", MOVIES_URL);
    moviesURLRequest.send();
  }

  const onMoviesLoaded = (movieUnparsedJSON, setMovieArray) =>
  {
    var movieArray = parseTextToMovieArray(movieUnparsedJSON);
    setMovieArray(movieArray);
  }

  const parseTextToMovieArray = (unparsedResponseText) =>
  {
    var moviesParsed = JSON.parse(unparsedResponseText);
    var movieArray = moviesParsed.movies;
    return movieArray;
  }

  const Sort = {
    ASCENDING : -1,
    DESCENDING: 1
  }
  
  const __internalSortMovieArray = (sortType) =>
  {
    const movieArrayClone = movieArray.slice();

    for(var i = 0; i < movieArrayClone.length; ++i)
    {
      var diffIndex = i;

      for(var j = i; j < movieArrayClone.length; ++j)
      {
        var currTitle = movieArrayClone[diffIndex][MOVIE_TITLE_KEY];
        var diffTitle = movieArrayClone[j][MOVIE_TITLE_KEY];
        
        var comp = diffTitle.localeCompare(currTitle) * sortType;
        
        if(comp > 0)
        {
          diffIndex = j;
        }

      }

      if(diffIndex == i)
      {
        continue;
      }

      var buffer = movieArrayClone[i];
      movieArrayClone[i] = movieArrayClone[diffIndex];
      movieArrayClone[diffIndex] = buffer;
    }
    setMovieArray(movieArrayClone);
  }

  const sortMovieArrayDescending = () => {
    __internalSortMovieArray(Sort.DESCENDING);
  }

  const sortMovieArrayAscending = () => {
    __internalSortMovieArray(Sort.ASCENDING);
  }


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


  const [movieArray, setMovieArray] = useState([]);

  const [performInitialLoad, setPerformInitialLoad] = useState(true);


  if(performInitialLoad)
  {
    loadMoviesToMovieList(setMovieArray);
    setPerformInitialLoad(false);
  }
  
  

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
        <TouchableOpacity style={sortButtonStyles.button} onPress={sortMovieArrayAscending}>
          <Text style={sortButtonStyles.text}>SORT MOVIES - Ascending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sortButtonStyles.button} onPress={sortMovieArrayDescending}>
          <Text style={sortButtonStyles.text}>SORT MOVIES - Descending</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


