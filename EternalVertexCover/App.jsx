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
import AttackerPage from './MainApp/Attacker/Attacker';
import Defender from './MainApp/Defender/Defender';
import PlayerVsPlayer from './MainApp/PlayerVsPlayer/PlayerVsPlayer';
import Level1 from './MainApp/PlayerVsPlayer/Levels/Level1';
import Level2 from './MainApp/PlayerVsPlayer/Levels/Level2';
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Eternal Vertex Cover " component={MainPage} />
          <Stack.Screen style = {styles.Button} name="Attacker" component={AttackerPage} />
          <Stack.Screen style = {styles.Button} name="Defender" component={Defender} />
          <Stack.Screen style = {styles.Button} name="PlayerVsPlayer" component={PlayerVsPlayer} />
          <Stack.Screen name="Level1" component={Level1} />
          <Stack.Screen name="Level2" component={Level2} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginVertical: 20
  },
});
