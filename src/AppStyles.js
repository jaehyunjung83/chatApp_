import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const AppStyles = {
  primaryColor: '#293462',
  secondaryColor: '#11818a',
  solidColor: '#b5b2b2',
  textColor: '#556677',
  titleColor: '#556677',
  inputTextColor: '#293462',
  colorBackground: '#293462',

  titleFontSize: 24,
  contentFontSize: 20,
  defaultFontSize: 16,

  iconSize: 28,

  buttonWidth: width * 0.6,
  buttonHeight: 42,

  textInputWidth: '80%',
  textInputBackgroundColor: '#556677',
  borderRadiusMain: 25,
  borderRadiusSmall: 5,
  width,
  height,
};
