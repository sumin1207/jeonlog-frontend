import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import TopBar from '@/components/ui/TopBar';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exhibitionData } from '../../data/exhibitionsDataStorage';
import ExhibitionLogCard from '@/components/exhibition/ExhibitionLogCard';
import { useFocusEffect } from 'expo-router';

export default function ExhibitionLogScreen() {
  const { theme } = useTheme();
  const [records, setRecords] = useState([]);

  const loadRecords = async () => {
    try {
      const savedRecordsJSON = await AsyncStorage.getItem('exhibition_records');
      const savedRecords = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};

      const visitedIdsJSON = await AsyncStorage.getItem('visited_exhibition_ids');
      const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];

      const loadedRecords = visitedIds.map(exhibitionId => {
        const exhibition = exhibitionData[exhibitionId as keyof typeof exhibitionData];
        return {
          exhibitionId,
          record: savedRecords[exhibitionId],
          exhibition,
        };
      }).filter(item => item.record); 
      setRecords(loadedRecords.reverse());
    } catch (error) {
      Alert.alert('오류', '전시 기록을 불러오는 중 문제가 발생했습니다.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
    },
    content: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme === 'dark' ? '#fff' : '#1c3519',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: theme === 'dark' ? '#ccc' : '#666',
    },
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>다른 사람들 전시 기록</Text>
        {records.length > 0 ? (
          <FlatList
            data={records}
            keyExtractor={(item) => item.exhibitionId}
            renderItem={({ item }) => (
              <ExhibitionLogCard record={item.record} exhibition={item.exhibition} />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 기록된 전시가 없습니다.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
