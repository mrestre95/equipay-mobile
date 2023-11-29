import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, withTheme, Badge, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Perfil from './Perfil';
import Actividad from './Actividad';
import Metricas from './Metricas';
import ListadoGrupos from './ListadoGrupos';
import {images} from './Images'
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';
import { useUserContext } from '../contexts/UserContext';
import { useEffect, useState } from 'react';


const Tab = createBottomTabNavigator();

NavigationBar = ({theme}) => {
  const {userName, notificationsCount} = useUserContext();
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    setBadgeCount(notificationsCount);
  }, [notificationsCount]);

  // const [fontsLoaded] = useFonts({
  //   'Quicksand': require('../assets/fonts/Quicksand-VariableFont_wght.ttf'),
  // });
  // if(!fontsLoaded){
  //   return null;
  // }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Puedes usar 'fade', 'slide_from_right', 'slide_from_left', 'slide_from_bottom', etc.

      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          style={{
            height:80,
            backgroundColor:theme.colors.background,
            borderTopColor:theme.colors.surfaceVariant,
            borderTopWidth:0.2,
          }}
          navigationState={state}
          safeAreaInsets={insets}
          shifting
          compact={true}
          onTabPress={({ route, preventDefault }) => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
        renderIcon={({ route, focused, color }) => {
          const { options } = descriptors[route.key];
          if (options.tabBarIcon) {
            return options.tabBarIcon({ focused, color, size: 23 });
          }

          return null;
        }}
        getLabelText={({ route }) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          return label;
        }}
        activeColor={theme.colors.onErrorContainer}
        inactiveColor={theme.colors.outline}
        />
      )}
    >
      <Tab.Screen
        name="Grupos"
        component={ListadoGrupos}
        options={{
          tabBarLabel: 'Grupos',
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon 
                name={focused ? 'people' : 'people-outline'} 
                size={size} 
                color={color} 
              />
          )},
        }}
      />
      <Tab.Screen
        name="Actividad"
        component={Actividad}
        options={{
          tabBarLabel: 'Actividad',
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={{ position: 'relative' }}>
                <Icon 
                  name={focused ? 'notifications' : 'notifications-outline'} 
                  size={size} 
                  color={color} 
                />
                {badgeCount > 0 &&
                  <Badge 
                    size={16} 
                    style={styles.badge}             
                  >
                    {badgeCount}
                  </Badge>
                }
              </View>
            )
          },
        }}
      />
      <Tab.Screen
        name="Metricas"
        component={Metricas}
        options={{
          tabBarLabelStyle:{paddingBottom:10},
          tabBarLabel: 'Estadisticas',
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon 
                name={focused ? 'stats-chart' : 'stats-chart-outline'} 
                size={size} 
                color={color} 
              />
            );        
          },
        }}
      />
      
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color, size }) => {
            return <Avatar.Image size={24} source={images[asignarIndiceSegunPrimeraLetra(userName)]} />;
          },
        }}
      />
      
    </Tab.Navigator>
  );
}

export default withTheme(NavigationBar)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar:{
    height:80,
    backgroundColor:'#141C1C',
    borderTopColor:'grey',
    borderTopWidth:0.2
  },
  item:{
    // fontFamily:'Quicksand',
    fontSize:10,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    fontSize:10
  }
});

