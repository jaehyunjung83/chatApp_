import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Title} from 'react-native-paper';
import FormButton from '../components/FormButton';
import {useDispatch, useSelector} from 'react-redux';
import {logOut} from '../actions/userActions';

export default function HomeScreen({navigation}) {
  const {userId} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Title>Home Screen</Title>
      <Title>{userId ? 'Logged In' : 'Logged Out'}</Title>
      <Title>All chat rooms will be listed here</Title>
      <FormButton
        modeValue="contained"
        title="Logout"
        onPress={() => dispatch(logOut())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
