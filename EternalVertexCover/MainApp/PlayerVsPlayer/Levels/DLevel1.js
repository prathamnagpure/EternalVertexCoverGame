import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import stages from '../../../assets/Stages';
import StageForA from '../../../components/StageForA';
const DLevels = [2,3,4,5,11];
export default class DLevel1 extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StageForA stage={stages[DLevels[this.props.route.params.levelno]]} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
