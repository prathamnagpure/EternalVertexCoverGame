import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import stages from '../../../assets/Stages';
import Stage from '../../../components/Stage';
const DLevels = [2,3,4,5,6];
export default class DLevel1 extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Stage
          isAttackerAuto={true}
          stage={stages[DLevels[this.props.route.params.levelno]]}
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
