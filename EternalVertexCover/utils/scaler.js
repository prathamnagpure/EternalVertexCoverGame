import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const guidelineBaseWidth = 350;
export const guidelineBaseHeight = 680;

const horizontalScale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export {horizontalScale, verticalScale, moderateScale};
