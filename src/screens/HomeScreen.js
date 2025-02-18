import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { List, Divider, Badge } from 'react-native-paper';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/functions';
import { fetchRooms } from '../actions/roomsActions';
import Loading from '../components/Loading';
// import {firebase} from '../config/firebase';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms());
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
          renderItem={({ item }) => (
            // console.log('home screen item', item),
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', { room: item })}
            >
              <List.Item
                title={item.roomname}
                description={item.latestMessage.text}
                right={(props) => (
                  <View style={styles.listLatestMessage}>
                    {item.OtherToRead ? (
                    <Badge style={{ backgroundColor: 'firebrick' }}>{item.OtherToRead}</Badge>
                    ): null}
                    <Text style={styles.listLatestMessageTime}>
                      {dayjs(item.latestMessage.createdAt)
                        .locale('ko')
                        // .format('LLLL')
                        .fromNow()}
                    </Text>
                  </View>
                )}
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
    backgroundColor: '#9bbbd4',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    color: 'black',
  },
  listDescription: {
    fontSize: 13,
    color: '#556661',
  },
  listLatestMessage: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listLatestMessageTime: {
    fontSize: 13,
    color: '#556661',
  },
});
