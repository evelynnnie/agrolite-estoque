import { StyleSheet, Text, View, ActivityIndicator, FlatList, ListRenderItemInfo } from 'react-native';
import React, {useEffect, useState} from 'react';
import {AgriculturalSupplies} from './src/types/agriculturalSupplies'
import api from './src/services/api';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [supplies, setSupplies] = useState<AgriculturalSupplies[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fecthData = async () => {
      try {
        setError(null);
        const response = await api.get('/supplies');
        setSupplies(response.data);
      } catch (err) {
        setError('Não foi possivel se conectar com o servidor ou buscar os insumos')
        console.error(err);
      } finally {
        setLoading(false);
      };
    };
    
    fecthData();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size={'large'} color={'#0000FF'} />}

      {!loading && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <FlatList 
        data={supplies}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          const isLowStock = item.quantity < item.minimumQuantity;

          return(
            <View style={[styles.card, isLowStock && styles.isLowCard]}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.infoText} >Quantidade: {item.quantity}</Text>
              {isLowStock && <Text style={styles.alertText}>Estoque baixo!</Text>}
            </View>
          )
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  isLowCard: {
    borderColor: '#e63946',
    backgroundColor: '#fff5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2b2d42',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
  },
  alertText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e63946',
    marginTop: 8,
  },
  errorText: {
    color: '#e63946',
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
  }
});
