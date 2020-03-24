import React from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';

export default function App() {
  const [scrollY, setScrollY] = React.useState(new Animated.Value(0));
  const [locationY, setLocationY] = React.useState(0);
  const [contentHeight] = React.useState(400);
  const [headerHeight] = React.useState(250);

  const onMove = (evnt) => {
    const pageY = evnt.nativeEvent.pageY;
    const height = Dimensions.get('window').height;
    const scroll = height - pageY - contentHeight + locationY;

    if (scroll < -headerHeight) setScrollY(new Animated.Value(-headerHeight));
    else if (scroll >= 0) setScrollY(new Animated.Value(0));
    else setScrollY(new Animated.Value(scroll));
  };

  const onRelease = (evnt) => {
    const array = evnt.touchHistory.touchBank.filter((obj) => typeof obj !== Object);
    const { currentPageY, startPageY } = array[0];
    const direction = startPageY - currentPageY;
    let toValue;

    if (direction < 0) {
      if (direction < -contentHeight * 0.3) {
        toValue = -headerHeight;
      } else toValue = 0;
    } else {
      if (direction > contentHeight * 0.3) toValue = 0;
      else toValue = -headerHeight;
    }

    Animated.timing(scrollY, {
      toValue,
      duration: 500,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View />
      <Animated.View
        onStartShouldSetResponder={(evt) => true}
        onResponderGrant={(evt) => setLocationY(evt.nativeEvent.changedTouches[0].locationY)}
        onResponderMove={onMove}
        onResponderRelease={onRelease}
        style={[styles.bottomBar, { bottom: scrollY, height: contentHeight }]}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aeaeae',
    justifyContent: 'space-between',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    borderTopLeftRadius: 47,
    borderTopRightRadius: 47,
  },
});
