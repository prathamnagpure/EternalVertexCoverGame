import {StyleSheet, Pressable, View} from 'react-native';
import {React, memo} from 'react';

const TouchableLine = memo(function TouchableLine({
  x1,
  y1,
  x2,
  y2,
  thickness,
  onEdgePress,
  isAttacked,
  moveGuard1,
  moveGuard2,
  id,
}) {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  let r = 30;

  const styles = StyleSheet.create({
    line: {
      position: 'absolute',
      left: x1 + (length / 2) * Math.cos((angle * Math.PI) / 180) - length / 2,
      top: (y1 + y2) / 2,
      width: length,
      height: thickness,
      transform: [{rotate: `${angle}deg`}],
    },

    lineColor: {
      backgroundColor: '#B87333',
    },

    attackedLineColor: {
      backgroundColor: 'red',
    },
    head2: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: thickness,
      borderBottomWidth: thickness,
      borderLeftWidth: 0,
      borderRightWidth: thickness * 2,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: 'blue', // Change this to the color you want
      position: 'absolute',
      left:
        x1 +
        r * Math.cos((angle * Math.PI) / 180) +
        thickness * Math.cos((angle * Math.PI) / 180) -
        thickness,
      top:
        y1 +
        r * Math.sin((angle * Math.PI) / 180) +
        thickness * Math.sin((angle * Math.PI) / 180) -
        thickness / 2,
      transform: [{rotate: `${angle}deg`}],
    },
    head1: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: thickness,
      borderBottomWidth: thickness,
      borderLeftWidth: 0,
      borderRightWidth: thickness * 2,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: 'blue', // Change this to the color you want
      position: 'absolute',
      left:
        x2 +
        r * Math.cos(((180 + angle) * Math.PI) / 180) +
        thickness * Math.cos(((180 + angle) * Math.PI) / 180) -
        thickness,
      top:
        y2 +
        r * Math.sin(((180 + angle) * Math.PI) / 180) +
        thickness * Math.sin(((180 + angle) * Math.PI) / 180) -
        thickness / 2,
      transform: [{rotate: `${angle + 180}deg`}],
    },
    headNone: {},
  });

  return (
    <Pressable
      onPressIn={() => {
        onEdgePress(id);
      }}>
      <View
        style={[
          styles.line,
          isAttacked ? styles.attackedLineColor : styles.lineColor,
        ]}
      />
      <View style={moveGuard1 ? styles.head1 : styles.headNone} />
      <View style={moveGuard2 ? styles.head2 : styles.headNone} />
    </Pressable>
  );
});

export default TouchableLine;
