import React from 'react';
import SettingsButton from './SettingsButton';
import {ReplayIcon} from './icons';
import {Pressable, View, StyleSheet} from 'react-native';
import {horizontalScale} from '../utils/scaler';

export default function LevelHeader({setRestartModalVisible}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => {
          setRestartModalVisible(true);
        }}>
        <ReplayIcon />
      </Pressable>
      <SettingsButton style={styles.settings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(20),
    marginRight: horizontalScale(5),
  },
});
