import {View, Text} from 'react-native';
export default function Timer({time, setTime, clearTimeObj}) {
  clearTimeObj(
    setTimeout(() => {
      setTime(prev => {
        prev - 1;
      });
    }, 1000),
  );
  return (
    <View style={{right: 0}}>
      <Text>time left is {time}</Text>
    </View>
  );
}
