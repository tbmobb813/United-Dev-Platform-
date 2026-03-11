const React = require('react');

function createHost(name) {
  const Component = React.forwardRef((props, ref) => React.createElement(name, { ...props, ref }, props.children));
  Component.displayName = name;
  return Component;
}

const View = createHost('View');
const Text = createHost('Text');
const TextInput = createHost('TextInput');
const TouchableOpacity = React.forwardRef((props, ref) =>
  React.createElement(
    'TouchableOpacity',
    {
      ...props,
      accessibilityRole: 'button',
      accessibilityState: {
        ...(props.accessibilityState || {}),
        disabled: Boolean(props.disabled),
      },
      onPress: props.disabled ? undefined : props.onPress,
      ref,
    },
    props.children,
  ),
);
TouchableOpacity.displayName = 'TouchableOpacity';
const ActivityIndicator = createHost('ActivityIndicator');
const Image = createHost('Image');
const ScrollView = createHost('ScrollView');
const SafeAreaView = createHost('SafeAreaView');

module.exports = {
  __esModule: true,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet: {
    create: styles => styles,
    flatten: styles => styles,
    hairlineWidth: 1,
  },
  Platform: {
    OS: 'ios',
    select: options => options.ios ?? options.default,
  },
  Dimensions: {
    get: () => ({ width: 750, height: 1334, scale: 2, fontScale: 2 }),
    addEventListener: () => ({ remove: () => {} }),
  },
};
