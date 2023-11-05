import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import stages from '../../../assets/Stages';
import Stage from '../../../components/Stage';
const ALevels = [7, 8, 9, 10, 11,12,13];
export default class ALevel extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Stage
          mode="autoDefender"
          stage={stages[ALevels[this.props.route.params.levelno]]}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
