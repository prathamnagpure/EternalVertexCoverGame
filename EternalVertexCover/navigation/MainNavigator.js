import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  MainPage,
  LevelLayout,
  Level,
  GraphMaker,
  ForTest,
  Import,
  Settings,
  Endless,
} from '../screens';
import SettingsButton from '../components/SettingsButton';
import LevelHeader from '../components';
import {DeleteButton} from '../components';
import Tutorial from '../screens/Tutorials';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainPage"
      screenOptions={{
        gestureDirection: 'horizontal',
        presentation: 'modal',
      }}>
      <Stack.Screen
        name="Endless"
        component={Endless}
        // options={{headerShown: false}}
      />

      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LevelLayout"
        component={LevelLayout}
        options={({route}) => ({
          title: route.params.title,
        })}
      />
      <Stack.Screen name="Imported Levels" component={Import} />
      <Stack.Screen
        name="Level"
        component={Level}
        options={({route}) => ({
          title: route.params.title
            ? route.params.title
            : 'Level ' + (route.params.index + 1),
        })}
      />
      <Stack.Screen
        name="Graph Maker"
        component={GraphMaker}
        options={{headerTitle: 'Level Maker'}}
      />
      <Stack.Screen name="testarea" component={ForTest} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
    </Stack.Navigator>
  );
}
export default MainNavigator;
