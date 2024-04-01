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
} from '../screens';
import SettingsButton from '../components/SettingsButton';
import {DeleteButton} from '../components';

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
          headerRight: () => SettingsButton({style: {right: '5%'}}),
          title: 'Level ' + (route.params.index + 1),
        })}
      />
      <Stack.Screen
        name="Graph Maker"
        component={GraphMaker}
        options={{headerTitle: 'Level Maker'}}
      />
      <Stack.Screen name="testarea" component={ForTest} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
export default MainNavigator;
