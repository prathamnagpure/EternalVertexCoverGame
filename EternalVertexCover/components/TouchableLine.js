import {Alert, StyleSheet, Pressable, View, Image} from 'react-native';
import {React, Component} from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import images from '../assets/Images';

export default class TouchableLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAttacked: false,
      moveGuard1: false,
      moveGuard2: false,
    };
  }

  render() {
    const length = Math.sqrt(
      Math.pow(this.props.x2 - this.props.x1, 2) +
        Math.pow(this.props.y2 - this.props.y1, 2),
    );
    const angle =
      Math.atan2(this.props.y2 - this.props.y1, this.props.x2 - this.props.x1) *
      (180 / Math.PI);
    let r = 30;

    const styles = StyleSheet.create({
      line: {
        position: 'absolute',
        left:
          this.props.x1 +
          (length / 2) * Math.cos((angle * Math.PI) / 180) -
          length / 2,
        top: (this.props.y1 + this.props.y2) / 2,
        width: length,
        height: this.props.thickness,
        transform: [{rotate: `${angle}deg`}],
      },

      lineColor: {
        backgroundColor: 'green',
      },

      attackedLineColor: {
        backgroundColor: 'red',
      },
      head2: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 0,
        borderRightWidth: 20,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'blue', // Change this to the color you want
        position: 'absolute',
        left:
          this.props.x1 +
          r * Math.cos((angle * Math.PI) / 180) +
          10 * Math.cos((angle * Math.PI) / 180) -
          10,
        top:
          this.props.y1 +
          r * Math.sin((angle * Math.PI) / 180) +
          10 * Math.sin((angle * Math.PI) / 180) -
          5,
        transform: [{rotate: `${angle}deg`}],
      },
      head1: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 0,
        borderRightWidth: 20,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'blue', // Change this to the color you want
        position: 'absolute',
        left:
          this.props.x2 +
          r * Math.cos(((180 + angle) * Math.PI) / 180) +
          10 * Math.cos(((180 + angle) * Math.PI) / 180) -
          10,
        top:
          this.props.y2 +
          r * Math.sin(((180 + angle) * Math.PI) / 180) +
          10 * Math.sin(((180 + angle) * Math.PI) / 180) -
          5,
        transform: [{rotate: `${angle + 180}deg`}],
      },
      headNone: {},
    });
    return (
      <Pressable
        onPressIn={() => {
          this.props.onEdgePress(this);
        }}>
        <View
          style={[
            styles.line,
            this.state.isAttacked ? styles.attackedLineColor : styles.lineColor,
          ]}
        />
        <View style={this.state.moveGuard1 ? styles.head1 : styles.headNone} />
        <View style={this.state.moveGuard2 ? styles.head2 : styles.headNone} />
      </Pressable>
    );
  }
}
