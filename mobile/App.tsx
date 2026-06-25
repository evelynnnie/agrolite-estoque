import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AgriculturalSupplies } from './src/types/agriculturalSupplies';
import api from './src/services/api';

const formatExpirationDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);

  if(limited.length < 4){
    return limited;
  };

  if (limited.length <= 6) {
    return `${limited.slice(0, 4)}-${limited.slice(4)}`;
  };

  return `${limited.slice(0, 4)}-${limited.slice(4, 6)}-${limited.slice(6)}`;
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [supplies, setSupplies] = useState<AgriculturalSupplies[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    minimumQuantity: '',
    expirationDate: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<AgriculturalSupplies | null>(null);

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;

    if(field === 'expirationDate'){
      newValue = formatExpirationDate(value)
    };

    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const registerSupply = async () => {
    if (!formData.name.trim() || !formData.quantity || !formData.minimumQuantity) {
      alert('Por favor, preencha todos os campos.');
      return;
    };

    const isEditing = editingSupply !== null;
    const url = isEditing ? `/supplies/${editingSupply?.id}` : `/supplies`;
    const method = isEditing ? 'put' : 'post';

    const today = new Date().toISOString().split('T')[0];

    if(formData.expirationDate && formData.expirationDate < today){
      alert('A data de validade não pode ser inferior à data atual')
      return;
    }

    try {
      const payload = {
        name: formData.name,
        quantity: Number(formData.quantity),
        minimumQuantity: Number(formData.minimumQuantity),
        expirationDate: formData.expirationDate,
      };

      const response = await api[method](url, payload);

      if (isEditing) {
        const updatedSupplies = supplies.map(item =>
          item.id === editingSupply.id ? response.data : item
        );
        setSupplies(updatedSupplies);
      } else {
        setSupplies([...supplies, response.data]);
      }

      setIsModalOpen(false);
      setEditingSupply(null);
      setFormData({ name: '', quantity: '', minimumQuantity: '', expirationDate: '' });
    } catch (error) {
      console.log('Erro ao salvar', error);
    }
  };

  const handleDeleteSupply = async (id: string) => {
    try {
      await api.delete(`/supplies/${id}`);
      const remainingSupplies = supplies.filter(item => item.id !== id);
      setSupplies(remainingSupplies);
    } catch (error) {
      console.log('Erro ao excluir');
    }
  };

  const handleUpdateQuantity = async (item: AgriculturalSupplies, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) return;

    try {
      const payload = {
        name: item.name,
        quantity: newQuantity,
        minimumQuantity: item.minimumQuantity,
        expirationDate: item.expirationDate,
      };

      const response = await api.put(`/supplies/${item.id}`, payload);

      const updatedSupplies = supplies.map(supply =>
        supply.id === item.id ? response.data : supply
      );

      setSupplies(updatedSupplies);
    } catch (error) {
      console.log('erro ao atualizar', error);
    }
  };

  const handleOpenNewSupplyModal = () => {
    setEditingSupply(null);
    setFormData({ name: '', quantity: '', minimumQuantity: '', expirationDate: '' });
    setIsModalOpen(true);
  };

  const setOpenEditSupplyModal = (supply: AgriculturalSupplies) => {
    setEditingSupply(supply);
    setFormData({
      name: supply.name,
      quantity: supply.quantity.toString(),
      minimumQuantity: supply.minimumQuantity.toString(),
      expirationDate: supply.expirationDate || '',
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await api.get('/supplies');
        setSupplies(response.data);
      } catch (err) {
        setError('Não foi possível se conectar com o servidor ou buscar os insumos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size='large' color='#0000FF' />}

      {!loading && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <FlatList
          data={supplies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isLowStock = item.quantity < item.minimumQuantity;

            return (
              <TouchableOpacity
                style={[styles.card, isLowStock && styles.isLowCard]}
                onPress={() => setOpenEditSupplyModal(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.infoText}>Quantidade: {item.quantity}</Text>
                {item.expirationDate ? <Text style={styles.infoText}>Validade: {item.expirationDate}</Text> : null}
                {isLowStock && <Text style={styles.alertText}>Estoque baixo!</Text>}
                
                <View style={styles.cardFooter}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.qtyControlBtn}
                      onPress={() => handleUpdateQuantity(item, -1)}
                    >
                      <Text style={styles.qtyControlText}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.qtyControlBtn}
                      onPress={() => handleUpdateQuantity(item, 1)}
                    >
                      <Text style={styles.qtyControlText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSupply(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Deletar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={handleOpenNewSupplyModal}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonAddText}>+ Adicionar Novo Insumo</Text>
      </TouchableOpacity>

      <Modal visible={isModalOpen} animationType='slide'>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingSupply ? 'Editar Insumo' : 'Cadastrar Insumo'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Insumo:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder='Ex: Ração Crescimento'
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade Atual:</Text>
            <TextInput
              style={styles.input}
              value={formData.quantity}
              onChangeText={(text) => handleInputChange('quantity', text)}
              placeholder='Ex: 50'
              keyboardType='numeric'
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade Mínima Requerida:</Text>
            <TextInput
              style={styles.input}
              value={formData.minimumQuantity}
              onChangeText={(text) => handleInputChange('minimumQuantity', text)}
              placeholder='Ex: 10'
              keyboardType='numeric'
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Expiração (Validade):</Text>
            <TextInput
              style={styles.input}
              value={formData.expirationDate}
              onChangeText={(text) => handleInputChange('expirationDate', text)}
              placeholder='AAAA-MM-DD (Ex: 2026-12-31)'
              maxLength={10}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonAdd, styles.btnModalSave]}
              onPress={registerSupply}
            >
              <Text style={styles.buttonAddText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonAdd, styles.btnModalCancel]}
              onPress={() => {
                setIsModalOpen(false);
                setEditingSupply(null);
              }}
            >
              <Text style={styles.buttonAddText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    shadowOffset: { width: 0, height: 1 },
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
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyControlBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qtyControlText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#334155',
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: '#e63946',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#334155',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  buttonAdd: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 45,
  },
  btnModalSave: {
    marginBottom: 0,
    backgroundColor: '#10b981',
  },
  btnModalCancel: {
    marginTop: 0,
    backgroundColor: '#94a3b8',
  },
  buttonAddText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});