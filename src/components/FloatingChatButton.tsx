import { Pressable, StyleSheet, View } from 'react-native';

type FloatingChatButtonProps = {
  onPress: () => void;
};

function RobotIcon() {
  return (
    <View style={styles.robot}>
      <View style={styles.antenna} />
      <View style={styles.antennaTip} />
      <View style={styles.robotHead}>
        <View style={styles.robotEarLeft} />
        <View style={styles.robotEarRight} />
        <View style={styles.robotFace}>
          <View style={styles.robotEye} />
          <View style={styles.robotEye} />
          <View style={styles.robotMouth} />
        </View>
      </View>
    </View>
  );
}

function FloatingChatButton({onPress}: FloatingChatButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Open financial assistant"
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.glow}>
        <RobotIcon />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    bottom: 86,
    position: 'absolute',
    right: 14,
    zIndex: 2,
  },
  pressed: {
    transform: [{scale: 0.94}],
  },
  glow: {
    alignItems: 'center',
    backgroundColor: '#071d47',
    borderColor: '#1d7eff',
    borderRadius: 43,
    borderWidth: 3,
    elevation: 16,
    height: 86,
    justifyContent: 'center',
    shadowColor: '#1685ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 18,
    width: 86,
  },
  robot: {
    height: 47,
    position: 'relative',
    width: 58,
  },
  antenna: {
    backgroundColor: '#f4f8ff',
    height: 10,
    left: 27,
    position: 'absolute',
    top: 0,
    width: 3,
  },
  antennaTip: {
    backgroundColor: '#f4f8ff',
    borderRadius: 5,
    height: 7,
    left: 25,
    position: 'absolute',
    top: -3,
    width: 7,
  },
  robotHead: {
    alignItems: 'center',
    backgroundColor: '#f0f5fb',
    borderColor: '#a8bbd0',
    borderRadius: 12,
    borderWidth: 2,
    height: 31,
    justifyContent: 'center',
    left: 6,
    position: 'relative',
    top: 12,
    width: 45,
  },
  robotEarLeft: {
    backgroundColor: '#dce8f4',
    borderRadius: 4,
    height: 13,
    left: -6,
    position: 'absolute',
    width: 6,
  },
  robotEarRight: {
    backgroundColor: '#dce8f4',
    borderRadius: 4,
    height: 13,
    position: 'absolute',
    right: -6,
    width: 6,
  },
  robotFace: {
    alignItems: 'center',
    backgroundColor: '#3988cb',
    borderRadius: 7,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    width: 31,
  },
  robotEye: {
    backgroundColor: '#f8fdff',
    borderRadius: 3,
    height: 5,
    marginHorizontal: 3,
    width: 5,
  },
  robotMouth: {
    backgroundColor: '#b7e1ff',
    bottom: 2,
    height: 2,
    position: 'absolute',
    width: 9,
  },
});

export default FloatingChatButton;
