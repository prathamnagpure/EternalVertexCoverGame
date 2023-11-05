import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import Stage from '../../../components/Stage';
import stages from '../../../assets/Stages';
const pvplevels = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

export default class Level1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Stage stage={stages[pvplevels[this.props.route.params.levelno]]} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
