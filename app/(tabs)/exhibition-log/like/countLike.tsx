
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountLikeProps {
  count: number;
}

const CountLike: React.FC<CountLikeProps> = ({ count }) => {
  return <Text style={styles.likeText}>{count}</Text>;
};

const styles = StyleSheet.create({
  likeText: {
    marginLeft: 4,
    fontSize: 16,
    color: 'black',
  },
});

export default CountLike;
