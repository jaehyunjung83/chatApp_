import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {List, Divider} from 'react-native-paper';

import {useDispatch, useSelector} from 'react-redux';
import {fetchRooms} from '../actions/roomsActions';
import Loading from '../components/Loading';

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const {rooms, loading} = useSelector((state) => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms());
    //console.log(unsubscribe);
    /**
     * unsubscribe listener
     */
  }, []);

  const renderLoadingScreen = () => {
    return <Loading />;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        renderLoadingScreen()
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', {room: item})}>
              <List.Item
                title={item.name}
                description={item.latestMessage.text}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
