import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Divider, withTheme } from 'react-native-paper';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';
import HiddenItem from './HiddenItem';

const SwipeableList = ({data, theme, handleSwipe, handleItemPress}) => {
  const navigation = useNavigation();
  const [dataGrupos, setDataGrupos] = useState(data)
  const keyExtractor = (item) => item.id;

  useEffect(() => {
    setDataGrupos(data);
  }, [data]);

  return (
    <SwipeListView
      data={dataGrupos}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }) => (
        <View>
          <ListItem
            key={item.id}
            content={item.nombre}
            date={item.fechaCreacion}
            description={item.descripcion}
            addButton={true}
            addDescription={true}
            action={() => handleItemPress(item.id, item.nombre)}
            color={theme.colors.onBackground}
          />
          {index < data.length - 1 && <Divider/>}
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <HiddenItem
          iconButton={"delete-outline"}
        />
      )}
      disableRightSwipe={true}
      rightOpenValue={-60}
      rightActionValue={-390}
      rightActivationValue={-90}
      onRightActionStatusChange={(data) => {
        setTimeout(() => {
          const dataGruposActualizada = dataGrupos.filter(item => item.id !== data.key);
          handleSwipe(data.key)
          setDataGrupos(dataGruposActualizada)
        }, 200); 
      }}
    />
  );
};

export default withTheme(SwipeableList);
