import React, { useCallback } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import CategoryFilter from '../Common/CategoryFilter'
import { Ionicons } from '@expo/vector-icons'

// Combines a search input and category chips filter
export default React.memo(function HomeFilters({ searchQuery, onSearchChange, categories, selectedCategory, onCategorySelect }) {
  const clearSearch = useCallback(() => onSearchChange(''), [onSearchChange])
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar libros..."
          value={searchQuery}
          onChangeText={onSearchChange}
          keyboardType="default"
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Ionicons name="close-circle" size={20} color="#666" onPress={clearSearch} style={styles.clearIcon} />
        )}
      </View>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={onCategorySelect}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
  clearIcon: {
    marginLeft: 6,
  },
})
