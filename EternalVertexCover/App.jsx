import {React, Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainPage from './MainApp/Main';
import Attacker from './MainApp/Attacker/Attacker';
import Defender from './MainApp/Defender/Defender';
import PlayerVsPlayer from './MainApp/PlayerVsPlayer/PlayerVsPlayer';
import Level1 from './MainApp/PlayerVsPlayer/Levels/Level1';
import DLevel1 from './MainApp/PlayerVsPlayer/Levels/DLevel1';
import ALevel from './MainApp/PlayerVsPlayer/Levels/ALevel';
import Import from './components/Import';
import GraphMaker from './components/GraphMaker';
import Options from './components/Options';
import fortest from './components/fortest';
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var fdata = require('./assets/graphMaps/file3.json');
    console.log(fdata['1,2,4;6']);
    var mp = new Map(Object.entries(fdata));
    console.log(mp.get('1,2,4;6')[0]);
    const config = {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    };
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            gestureDirection: 'horizontal',
            presentation: 'modal',
          }}>
          <Stack.Screen name="Eternal Vertex Cover " component={MainPage} />
          <Stack.Screen
            style={styles.Button}
            name="Attacker"
            component={Attacker}
          />
          <Stack.Screen
            style={styles.Button}
            name="Defender"
            component={Defender}
          />
          <Stack.Screen
            style={styles.Button}
            name="PlayerVsPlayer"
            component={PlayerVsPlayer}
          />
          <Stack.Screen
            style={styles.Button}
            name="Imported Levels"
            component={Import}
          />
          <Stack.Screen name="Level1" component={Level1} />
          <Stack.Screen name="DLevel1" component={DLevel1} />
          <Stack.Screen name="ALevel" component={ALevel} />
          <Stack.Screen name="graphMaker" component={GraphMaker} />
          <Stack.Screen name="testarea" component={fortest} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  Button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginVertical: 20,
  },
});
