import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const emojis = ['😀','😂','😍','👍','🙏','🎉','🔥','🥳','😎','🤔', '🙌', '💪', '😢', '😭', '😡','💯',"❤️","✨","😴","🤷‍♂️","🤖","👻"]; // example emojis

const SimpleEmojiPicker = ({ onEmojiSelected }) => {
  return (
    <View style={styles.container}>
      {emojis.map((emoji, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => onEmojiSelected(emoji)}
          style={styles.emojiWrapper}
          activeOpacity={0.7}
        >
          <Text style={styles.emojiText}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  emojiWrapper: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  emojiText: {
    fontSize: 26,
    lineHeight: 38,
  },
});

export default SimpleEmojiPicker;


//,"❤️","✨","😴","🤷‍♂️","🤖","👻"