import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ProductCard from './components/ProductCard';
import { PRODUCTS } from './data/products';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [refreshing, setRefreshing] = useState(false);
  const [gridView, setGridView] = useState(false);
  const [sortType, setSortType] = useState('');

  const categories = ['Semua', 'Pakaian', 'Sepatu', 'Aksesoris', 'Gadget'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  let filteredProducts = PRODUCTS.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === 'Semua' ||
      item.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  if (sortType === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        ShopList ({filteredProducts.length} Produk)
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Cari produk..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              selectedCategory === cat && styles.activeChip,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setGridView(!gridView)}
        >
          <Text>{gridView ? 'List View' : 'Grid View'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSortType('low')}
        >
          <Text>Harga ↑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSortType('rating')}
        >
          <Text>Rating ⭐</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        key={gridView ? '2' : '1'}
        numColumns={gridView ? 2 : 1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard item={item} isGrid={gridView} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>😢</Text>
            <Text>Produk tidak ditemukan</Text>
            <Text>Coba kata kunci lain</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  chip: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: '#74b9ff',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  button: {
    backgroundColor: '#dfe6e9',
    padding: 10,
    borderRadius: 10,
  },
  empty: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 50,
  },
});