import React from 'react';
import { withTheme } from 'react-native-paper';
import {Text} from 'react-native';
import {Box} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ErrorMessage = ({ message, theme, type }) => (
  <Box
    bg={type === 'success' ? theme.colors.secondaryContainer  : theme.colors.errorContainer}
    px="2"
    py="2"
    rounded="xl"
    marginX={5}
    marginTop={5}
    flexDirection="row"
    alignItems="center"
    width={360}
  >
    <Icon 
      size={25} 
      color={theme.colors.onSurface} 
      name= {type === 'success' ? "check"  : "alert-circle-outline"}  
      style={{ marginRight: 5 }} 
    />
    <Text style={{color:theme.colors.onSurface}}>
      {message}
    </Text>
  </Box>
);

export default withTheme(ErrorMessage);
