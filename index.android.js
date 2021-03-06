/**
*
**/

import React, { Component } from 'react';

import MapView from 'react-native-maps';

import PriceMarker from './PriceMarker';

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
  syncStorage() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        this.setState({recordCount: stores.length});
        this.setState({lastRecords: stores});
      });
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      gotGpsData: false,
      message: '',
      spentMoney: 0,
      filledLiters: 0,
      droveMilliage: 0,
      initialCoords: 'unknown',
      recordCount: 0,
      lastRecords: [],
    };
    this.syncStorage();
  }

  clearTextInputs(){
    //
  }

  saveData() {
    var saveData = {
      "longitude": this.state.initialCoords.longitude,
      "latitude": this.state.initialCoords.latitude,
      "spentMoney": this.state.spentMoney,
      "filledLiters": this.state.filledLiters,
      "droveMilliage": this.state.filledLiters,
      "timestamp": Math.round(new Date().getTime() / 1000),
    };
    AsyncStorage.setItem("record_"+this.state.recordCount+1, JSON.stringify(saveData)).then(
      this.setState({message: "Saved record #"+this.state.recordCount+1})
    ).then(this.clearTextInputs()).then(this.syncStorage()).done(
      this.render()
    );
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
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
        >
          <MapView.Marker
           coordinate={this.state.initialCoords}
           draggable
          >
            <PriceMarker amount={this.state.spentMoney} />
          </MapView.Marker>
         {
           this.state.lastRecords.map(function(item, index){

             item = JSON.parse(item[1])
             coords = { latitude: item.latitude, longitude: item.longitude }
             return (
               <MapView.Marker
                coordinate = { coords }
                draggable
               >
                 <PriceMarker amount={item.spentMoney} />
               </MapView.Marker>
             )
           }.bind(this))
         }
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
          <Text style={styles.button}>Save</Text>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          {this.state.message}
        </Text>
        <Text style={styles.instructions}>
          Your fuel consumption on this {this.state.droveMilliage} km is {Math.round(this.state.filledLiters * 100 / this.state.droveMilliage *100)/100} l/100km
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
