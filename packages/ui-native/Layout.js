import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Stack = ({
  children,
  direction = 'column',
  gap = 'medium',
  align = 'stretch',
  justify = 'flex-start',
  style,
}) => {
  const gapSize = gap === 'small' ? 8 : gap === 'large' ? 24 : 16;

  return (
    <View
      style={[
        styles.stack,
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          gap: gapSize,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Container = ({
  children,
  maxWidth,
  padding = 'medium',
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        { maxWidth },
        styles[`${padding}Padding`],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  smallPadding: {
    padding: 8,
  },
  mediumPadding: {
    padding: 16,
  },
  largePadding: {
    padding: 24,
  },
});
