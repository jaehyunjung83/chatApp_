import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useSelector, useDispatch} from 'react-redux';

import {emailValid} from '../utils';
import {AppStyles} from '../AppStyles';
import Loading from '../components/Loading';
import {loginUser, resetPassword} from '../actions/userActions';
import ResetPassword from '../components/resetPassword/ResetPassword';

export default function SignUpScreen({navigation}) {
  const {control, handleSubmit, errors, clearErrors, setError} = useForm({
    defaultValues: {email: '', password: '', confirmPassword: ''},
  });
  const [modalVisible, setModalVisible] = useState(false);
  const {loading} = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const sendResetPasswordLink = (email) => {
    dispatch(resetPassword(email));
    setModalVisible(false);
  };
  const resetPasswordModal = () => {
    setModalVisible(!modalVisible);
  };

  const onSubmitHandler = (data) => {
    dispatch(loginUser(data.email, data.password));
  };

  const isEmailValid = (email) => {
    let result = emailValid(email);
    if (!result) {
      setError('email', {
        type: 'validate',
        message: 'Not valid e-mail. ',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Text style={[styles.title]}>Sign In</Text>
      <Controller
        control={control}
        render={({onChange, value}) => (
          <View style={styles.InputContainer}>
            <TextInput
              onEndEditing={(e) => {
                isEmailValid(e.nativeEvent.text);
              }}
              style={styles.body}
              placeholder="E-mail"
              onChangeText={(value) => onChange(value.trim())}
              value={value}
              autoCapitalize="none"
              textContentType="emailAddress"
              onFocus={() => clearErrors('email')}
              placeholderTextColor={AppStyles.solidColor}
              underlineColorAndroid="transparent"
              keyboardType="email-address"
            />
          </View>
        )}
        name="email"
        rules={{
          required: {
            value: true,
            message: 'Enter your e-mail address',
          },
        }}
      />
      {errors?.email && (
        <Text style={styles.errorText}>{errors?.email?.message}</Text>
      )}
      <Controller
        control={control}
        render={({onChange, value}) => (
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(value) => onChange(value.trim())}
              onFocus={() => clearErrors('password')}
              value={value}
              autoCapitalize="none"
              placeholderTextColor={AppStyles.solidColor}
              underlineColorAndroid="transparent"
            />
          </View>
        )}
        name="password"
        rules={{
          required: {
            value: true,
            message: 'Password is required.',
          },
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        }}
      />
      {errors?.password && (
        <Text style={styles.errorText}>{errors?.password?.message}</Text>
      )}
      <TouchableOpacity
        style={styles.loginContainer}
        onPress={handleSubmit(onSubmitHandler)}>
        {loading ? <Loading /> : <Text style={styles.loginText}>SIGN IN</Text>}
      </TouchableOpacity>
      <View style={styles.footerStyle}>
        <>
          <TouchableOpacity
            style={styles.subButton}
            onPress={() => resetPasswordModal()}>
            <Text style={styles.subText}> Forget Password</Text>
          </TouchableOpacity>
          <Text style={styles.subText}> / </Text>
        </>
        <TouchableOpacity
          style={styles.subButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.subText}>Create User</Text>
        </TouchableOpacity>
      </View>
      <ResetPassword
        isDialogVisible={modalVisible}
        closeDialog={resetPasswordModal}
        submitInput={sendResetPasswordLink}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyles.primaryColor,
  },
  subText: {
    color: AppStyles.solidColor,
  },
  subButton: {},
  footerStyle: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signUpButton: {
    width: AppStyles.buttonWidth / 2,
    height: AppStyles.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.secondaryColor,
    borderRadius: AppStyles.borderRadiusMain,
    padding: 10,
    marginTop: 30,
  },
  signUpText: {
    color: AppStyles.textColor,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: AppStyles.defaultFontSize,
  },
  title: {
    fontSize: AppStyles.titleFontSize,
    fontWeight: 'bold',
    color: AppStyles.titleColor,
    marginTop: 20,
    marginBottom: 20,
  },
  loginContainer: {
    width: AppStyles.buttonWidth,
    height: AppStyles.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.secondaryColor,
    borderRadius: AppStyles.borderRadiusMain,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.textColor,
    fontWeight: 'bold',
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.solidColor,
    borderRadius: AppStyles.borderRadiusMain,
    backgroundColor: AppStyles.textInputBackgroundColor,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.inputTextColor,
  },
});
