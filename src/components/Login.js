import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {getTotalDiskCapacity} from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../actions/userActions';

export default function Login() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state);
  useEffect(() => {
    dispatch(login());
  }, []);
  return (
    <View>
      <TouchableOpacity>
        <Text>Login</Text>
      </TouchableOpacity>
      {console.log(data)}
    </View>
  );
}
