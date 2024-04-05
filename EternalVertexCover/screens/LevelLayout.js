import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useState, useEffect} from 'react';
import {GraphPreview} from '../components';
import stages from '../assets/Stages';
import Images from '../assets/Images';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {DoneIcon} from '../components/icons';
import {getData} from '../utils/storage';
import {MODES} from '../constants';
import CompletedLevelsContext from '../contexts/CompletedLevelsContext';

const LevelLayout = ({navigation, route}) => {
  const {levels, mode} = route.params;
  const {completedLevels} = useContext(CompletedLevelsContext);
  const levelButtons = levels.map((level, index) => {
    const buttonLabel = `Level ${index + 1}`;
    const navigate = () => navigation.navigate('Level', {levels, mode, index});
    return {level, navigate, buttonLabel, index};
  });
  levelButtons.push({
    level: 0,
    navigate: () => navigation.navigate('Tutorial'),
    buttonLabel: 'Tutorial',
    index: levelButtons.length,
    notShow: true,
  });

  return (
    <ImageBackground
      source={Images.levellayoutgif}
      resizeMode="cover"
      style={[styles.container]}>
      <View style={styles.listContainer}>
        <FlatList
          data={levelButtons}
          style={{marginBottom: 10}}
          renderItem={({item}) => {
            return (
              <>
                {!item.notShow && (
                  <Pressable
                    style={styles.button}
                    key={item.level}
                    onPress={item.navigate}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.buttonText} numberOfLines={1}>
                        {item.buttonLabel}
                      </Text>
                      {((mode === MODES.AUTO_ATTACKER &&
                        completedLevels.completedDefenderLevels[item.index]) ||
                        (mode === MODES.AUTO_DEFENDER &&
                          completedLevels.completedAttackerLevels[
                            item.index
                          ])) && <DoneIcon />}
                    </View>
                    <GraphPreview
                      stage={stages[item.level]}
                      height={verticalScale(200)}
                      width={horizontalScale(200)}
                    />
                  </Pressable>
                )}
                {item.notShow && <View style={{height: verticalScale(110)}} />}
              </>
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    transform: [{scale: 1}],
    // justifyContent: 'center',
  },
  title: {
    fontSize: horizontalScale(32),
    fontWeight: 'bold',
    color: 'white', // Set the title color to white in dark mode
  },
  titleContainer: {
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: horizontalScale(24),
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: '3%',
    width: horizontalScale(310),
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: horizontalScale(20),
  },
  listContainer: {
    marginTop: verticalScale(50),
    justifyContent: 'center',
    width: horizontalScale(320),
    height: horizontalScale(600),
  },
});

export default LevelLayout;
