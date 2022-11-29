import * as React from 'react';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';


export default function App() { 
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('PERMISSÃO NEGADA');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }),

        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 };
    })();
  }, []);

  let text = 'Aguardando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>      

      <MapView
        onMapReady={() => {
          Platform.OS === 'android'
            ? PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              ).then(() => {
                console.log('PERMITIDO!');
              })
            : '';
        }}
        style={styles.map}        
        initialRegion={region}
        zoomEnabled={true}
        showsUserLocation={true}
        loadingEnabled={true}
      >   
       
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
