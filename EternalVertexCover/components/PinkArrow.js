import Images from '../assets/Images';
import {Image} from 'react-native';
import {StyleSheet} from 'react-native';

export default function PinkArrow({x1, y1, x2, y2, diffx, diffy}) {
  console.log('inside pinkArrow');
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const styles = StyleSheet.create({
    line: {
      position: 'absolute',
      // left: x1 + (length / 2) * Math.cos((angle * Math.PI) / 180) - length / 2,
      // // length / 2
      // top: y1, //(y1 + y2) / 2,
      top: y1 - diffy,
      left: x1 - diffx,

      // width: length,
      // height: 200,
      // flex: 1,
      transform: [{rotate: `${angle}deg`}, {scale: 0.5}],
      // borderColor: 'red',
      // borderWidth: 50,
      justifyContent: 'center',
    },
  });
  return (
    <Image
      // style={{
      //   width: length,
      //   height: length,
      //   // borderColor: 'blue',
      //   // borderWidth: 20,
      // }}
      style={styles.line}
      source={Images.pinkArrow}
    />
  );
}
