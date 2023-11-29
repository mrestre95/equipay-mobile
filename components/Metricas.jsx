import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, withTheme, Divider  } from 'react-native-paper';
import TopBar from './TopBar';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { getTotalPagosPorGrupo, getTotalUltimosDoceMeses, getValorTotalPagosRealizados } from '../apis/resumenControllerAPI';
import { useUserContext } from '../contexts/UserContext';
import { useIsFocused } from '@react-navigation/native';


const Metricas = ({ theme }) => {
	const screenWidth = Dimensions.get('window').width - 1;
	const [isLoading, setIsLoading] = useState(false);
  const [pagosEnPesos, setPagosEnPesos] = useState([]);
  const [pagosEnDolares, setPagosEnDolares] = useState([]);
  const [pagosPorGrupos, setPagosPorGrupos] = useState([]);
  const [totalUltimosDoceMeses, setTotalUltimosDoceMeses] = useState([]);


	const { loggedUser, userToken } = useUserContext();
	const isFocused = useIsFocused();

	
	const fetchData = async () => {
		try {
			setIsLoading(true)
			const pagos = await getValorTotalPagosRealizados(loggedUser, userToken);
			const pagosPorGrupo = await getTotalPagosPorGrupo(loggedUser, 'UYU', userToken);
			const gatosCubiertosUltimosDoceMeses = await getTotalUltimosDoceMeses(loggedUser, 'UYU', userToken);
			if(pagos.length !=0){
        const deudasEnPesos = [];
        const deudasEnDolares = [];
  
        pagos.forEach((pago) => {
          if (pago.moneda === "USD") {
            deudasEnDolares.push(pago);
          } 
          else if (pago.moneda === "UYU") {
            deudasEnPesos.push(pago);
          }
        });
        setPagosEnPesos(deudasEnPesos);
        setPagosEnDolares(deudasEnDolares);
				setPagosPorGrupos(pagosPorGrupo);
				setTotalUltimosDoceMeses(gatosCubiertosUltimosDoceMeses);
			}
		}
		catch (error) {
			console.error('Error:', error);
			if (error.response) {
				// Si la respuesta contiene datos, imprime el cuerpo de la respuesta
				console.log('Cuerpo de la respuesta de error:', error.response.data);
			}
		} 
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
    if (isFocused) // Verifica si el componente está enfocado
      fetchData(); // Si está enfocado, realiza la solicitud de datos
  }, [isFocused]);

  return (
			<ScrollView>
      <TopBar
        appBarTitle={"Estadisticas"}
        mode={"center-aligned"}
      />

		<View style={styles.container}>
      <Text>Total gastos por Mes</Text>
      
      {totalUltimosDoceMeses.length > 0 ? (
        <LineChart
          data={{
            labels: totalUltimosDoceMeses.map(item => item.mesAbreviado),
            datasets: [
              {
                data: totalUltimosDoceMeses.map(item => item.valor / 1000)
              }
            ]
          }}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: theme.colors.chartBackground,
            backgroundGradientTo: theme.colors.chartBackground,
            decimalPlaces: 2,
            color: (opacity = 0.6) => `${theme.colors.primary}, ${opacity})`,
            labelColor: (opacity = 0.6) => `${theme.colors.onBackground}, ${opacity})`,
            useShadowColorFromDataset: false,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: theme.colors.onTertiary
            }
          }}
          bezier
          withInnerLines={false}
          style={{
            marginVertical: 15,
            borderRadius: 16,
          }}
        />
      ) : (
				<View style={{marginVertical:60}}>
					<Text>No hay datos disponibles</Text>
				</View>      
			)}

				<Divider style={{width:'60%', marginTop:5, marginBottom:15}}/>
				<Text>Total pagos por moneda</Text>
				{pagosEnPesos.length > 0 || pagosEnDolares > 0 ? (

				<BarChart
					style={{
						marginVertical: 15,
						borderRadius: 16,
						marginLeft:15,
						marginRight:15,
					}}
					data={{
						labels: ['UYU', 'USD'],
						datasets: [
							{
								data: [pagosEnPesos.length !== 0 ? pagosEnPesos[0].valor : 0, pagosEnDolares.length !== 0 ? pagosEnDolares[0].valor : 0],
							},
						],
					}}
					chartConfig={{
						barPercentage:1.2,
						//backgroundColor:'#F5F5F5',
						backgroundGradientFrom: theme.colors.chartBackground,
						backgroundGradientTo: theme.colors.chartBackground,
						color: (opacity = 1) => `${theme.colors.error}, ${opacity})`,
						strokeWidth: 2,
						labelColor: (opacity = 0.6) => `${theme.colors.onBackground}, ${opacity})`,
					}}
					width={screenWidth}
					height={220}
					yAxisLabel="$"
					verticalLabelRotation={0}
					withInnerLines={false}
					showValuesOnTopOfBars
					fromZero
				/>
				) : (
						<View style={{marginVertical:60}}>
						<Text>No hay datos disponibles</Text>
					</View>
		
				)}
				<Divider style={{width:'60%', marginTop:5, marginBottom:15}}/>
				<Text>Total pagos por grupo</Text>

				{pagosPorGrupos.length > 0 ? (
					<BarChart
						style={{
							marginVertical: 15,
							borderRadius: 16,
							marginLeft:15,
							marginRight:15,
						}}
						data={{
							labels: pagosPorGrupos.map(item => item.nombreGrupo),
							datasets: [
								{
									data: pagosPorGrupos.map(item => item.valor),
								},
							],
						}}
						chartConfig={{
							barPercentage:1.2,
							//backgroundColor:'#F5F5F5',
							backgroundGradientFrom: theme.colors.chartBackground,
							backgroundGradientTo: theme.colors.chartBackground,
							color: (opacity = 1) => `${theme.colors.chart4}, ${opacity})`,
							strokeWidth: 2,
							labelColor: (opacity = 0.6) => `${theme.colors.onBackground}, ${opacity})`,
						}}
						width={screenWidth}
						height={220}
						yAxisLabel="$"
						verticalLabelRotation={0}
						withInnerLines={false}
						showValuesOnTopOfBars
						fromZero
					/>
				) : (
					<View style={{marginVertical:60}}>
						<Text>No hay datos disponibles</Text>
					</View>
				)}
			</View>
		</ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
		justifyContent:'center',
		alignItems:'center',
		marginVertical:10,

  },
});

export default withTheme (Metricas);
