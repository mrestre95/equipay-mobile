import React from "react";
import { View, StyleSheet} from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuOption = ({theme, iconName, buttonName, color, action}) => {
    return (
			<View style={styles.option}>
				<Icon 
					name={iconName} 
					size={20} 
					color={color}>
				</Icon>
				<Button
						mode='text'
						style={{flex: 1}}
						icon={() => <Icon name="chevron-forward-outline" size={20} style={{marginRight:-5}} color={color}/>}
						labelStyle={{fontSize:16, marginLeft:13}}
						textColor={color}
						contentStyle={{justifyContent:'space-between', flexDirection:'row-reverse'}}
						onPress={action}
				>
						{buttonName}
				</Button>
			</View>
    )
}

const styles = StyleSheet.create({
	option:{
		flexDirection:'row',
		alignItems:'center',
		marginHorizontal:15,
		marginVertical:11
	}

});

export default withTheme(MenuOption);