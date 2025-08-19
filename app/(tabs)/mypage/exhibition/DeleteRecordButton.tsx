import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, StyleProp, ViewStyle, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useExhibition } from '../../../../contexts/ExhibitionContext'; // Import useExhibition

interface DeleteRecordButtonProps {
  exhibitionId: string;
  onRecordDeleted: () => void;
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function DeleteRecordButton({ exhibitionId, onRecordDeleted, title, buttonStyle, textStyle }: DeleteRecordButtonProps) {
  const { theme } = useTheme();
  const { toggleVisited } = useExhibition(); // Get toggleVisited from context

  const handleDelete = async () => {
    Alert.alert(
      '기록 삭제',
      '정말로 이 전시 기록을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            try {
              // Remove the exhibition from the visited list using the context function
              toggleVisited(exhibitionId);

              // Still need to delete the specific record data
              const savedRecordsJSON = await AsyncStorage.getItem('exhibition_records');
              let savedRecords = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};
              delete savedRecords[exhibitionId];
              await AsyncStorage.setItem('exhibition_records', JSON.stringify(savedRecords));

              onRecordDeleted(); // This reloads reviews on the visited page
              Alert.alert('성공', '기록이 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '기록을 삭제하는 중 문제가 발생했습니다.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleDelete}
      style={[
        styles.button,
        { backgroundColor: theme === 'dark' ? '#7A8A7A' : '#7A8A7A' },
        buttonStyle,
      ]}
    >
      <Text style={[styles.text, { color: '#fff' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});