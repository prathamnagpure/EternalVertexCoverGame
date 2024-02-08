import {React, Component} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
// import Stage from './components/Stage';
// import stages from './assets/Stages';
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
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Main">
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
