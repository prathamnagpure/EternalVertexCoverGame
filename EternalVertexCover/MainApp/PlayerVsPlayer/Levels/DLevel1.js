import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import stages from '../../../assets/Stages';
import StageForA from '../../../components/StageForA';
<<<<<<< HEAD
const DLevels = [2,3,4,5,11];
=======
import Stage from '../../../components/Stage';
const DLevels = [2, 3, 4, 5];
>>>>>>> 4f0b4d90df250f107fa5171523efe8e338b7d87b
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
