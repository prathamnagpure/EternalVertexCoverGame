import React from 'react';
import {View, Pressable, StyleSheet, TextInput} from 'react-native';
import KebabMenuIcon from './icons/KebabMenuIcon';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';

export default function ImportHeader(
  setIsModalVisible,
  isSearchClicked,
  filterString,
  setFilterString,
  setIsSearchClicked,
) {
  return (
    <View style={styles.container}>
      <View
        style={
          isSearchClicked
            ? [styles.searchViewClicked, styles.searchView]
            : styles.searchView
        }>
        {isSearchClicked && (
          <TextInput
            style={styles.input}
            onChangeText={setFilterString}
            value={filterString}
            placeholder="search level name"
            placeholderTextColor={'gray'}
          />
        )}
        <View style={styles.buttonView}>
          <Pressable
            onPress={() => {
              setIsSearchClicked(prevIsSearchClicked => !prevIsSearchClicked);
            }}
            android_ripple={{color: 'gray', borderless: true}}
            style={styles.optionsButton}>
            {isSearchClicked ? (
              <CloseIcon size={20} />
            ) : (
              <SearchIcon size={30} />
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Pressable
          onPress={() => {
            setIsModalVisible(true);
          }}
          android_ripple={{color: 'gray', borderless: true}}
          style={styles.optionsButton}>
          <KebabMenuIcon size={30} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    right: '10%',
  },

  buttonView: {
    backgroundColor: '#fff',
    borderRadius: 100,
    overflow: 'hidden',
  },
  optionsButton: {
    backgroundColor: '#fff',
  },
  input: {
    color: '#000',
    flex: 1,
    padding: 2,
    margin: 2,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '1%',
    paddingRight: '1%',
  },
  searchViewClicked: {
    flex: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    borderWidth: 1,
  },
});
