/**
*
**/

import React, { Component } from 'react';

import MapView from 'react-native-maps';

import PriceMarker from './PriceMarker';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  AppRegistry,
  AsyncStorage,
  Image,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class gas_counter_map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gotGpsData: false,
      message: '',
      spentMoney: 0,
      filledLiters: 0,
      droveMilliage: 0,
      initialCoords: 'unknown',
    };
  }

  saveData() {
    var saveData = {
      "longitude": this.state.initialCoords.longitude,
      "latitude": this.state.initialCoords.latitude,
      "spentMoney": this.state.spentMoney,
      "filledLiters": this.state.filledLiters,
      "droveMilliage": this.state.filledLiters,
    };
    AsyncStorage.setItem("index", JSON.stringify(saveData)).then(
      this.setState({message: "Saved"})
    ).done();
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
       stores.map((result, i, store) => {
         // get at each store's key/value so you can work with it
         let key = store[i][0];
         let value = store[i][1];
         console.log(key);
         console.log(value);
        });
      });
    });
    debugger;
  }

  getGpsData() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({initialCoords: position.coords});
        this.setState({gotGpsData: true});
      },
      (error) => alert(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    navigator.geolocation.watchPosition(
      (position) => {
        var lastPosition = JSON.stringify(position);
        this.setState({initialCoords: position.coords});
        this.setState({gotGpsData: true});
        this.render();
      },
      (error) => {}
    );
  }

  renderLoadingView(){
    return (
      <View style={styles.container}>
        <ProgressBarAndroid />
        <Text style={styles.instructions}>
          Receiving GPS information...
        </Text>
      </View>
    );
  }

  render() {
    if (!this.state.gotGpsData) {
      this.getGpsData();
      return this.renderLoadingView();
    }
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            longitude: this.state.initialCoords.longitude,
            latitude: this.state.initialCoords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapView.Marker
           coordinate={this.state.initialCoords}
           draggable
         >
           <PriceMarker amount={this.state.spentMoney} />
         </MapView.Marker>
        </MapView>
        <Text style={styles.instructions}>
          Spent money
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(spentMoney) => this.setState({spentMoney})}
          value={this.state.text}
          keyboardType={'numeric'}
        />
        <Text style={styles.instructions}>
          Filled-in liters
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(filledLiters) => this.setState({filledLiters})}
          value={this.state.text}
          keyboardType={'numeric'}
        />
        <Text style={styles.instructions}>
          Milliage from the last point
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(droveMilliage) => this.setState({droveMilliage})}
          value={this.state.text}
          keyboardType={'numeric'}
        />
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={'white'}
          onPress={() => this.saveData()}>
          <Text style={styles.button}>Tap</Text>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          {this.state.message}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: 150,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('gas_counter_map', () => gas_counter_map);
