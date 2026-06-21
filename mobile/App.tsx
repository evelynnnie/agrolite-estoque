import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, {useEffect, useState} from 'react';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testando...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const tryConnection = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/supplies`);

        if(response.ok){
          setConnectionStatus('Conexão estabelecida');
        } else {
          setConnectionStatus('Erro: O servidor respondeu mas houve um problema');
        }
      } catch (error) {
        setConnectionStatus('Não foi possivel se conectar com o servidor')
      } finally {
        setLoading(false);
      };
    };

    
    tryConnection();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={'large'} color={'#0000FF'} />
      ) : (
        <Text style={styles.text}>{connectionStatus}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20
  }
});
