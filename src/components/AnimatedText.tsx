import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AnimatedScreenProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide';
}

const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ children, animationType = 'fade' }) => {
  const animatedValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    let animation;
    if (animationType === 'slide') {
      animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      });
    } else {
      animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      });
    }

    animation.start();
  }, [animatedValue, animationType]);

  return (
    <Animated.View
      style={[
        styles.container,
        animationType === 'fade' && { opacity: animatedValue },
        animationType === 'slide' && {
          transform: [{ translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
        },
      ]}
    >
      <View style={styles.innerContainer}>{children}</View> {/* Ensure children are inside a View */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});

export default AnimatedScreen;