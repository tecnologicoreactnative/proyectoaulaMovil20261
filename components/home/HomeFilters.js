import React, { useCallback } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import CategoryFilter from '../Common/CategoryFilter'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../colors'

// Combines a search input and category chips filter
export default React.memo(function HomeFilters({ searchQuery, onSearchChange, categories, selectedCategory, onCategorySelect }) {
  const clearSearch = useCallback(() => onSearchChange(''), [onSearchChange])
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar libros..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            keyboardType="default"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={clearSearch} style={styles.clearIcon} />
          )}
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
    height: 44,
  },
  icon: {
    opacity: 0.8,
  },
  clearIcon: {
    opacity: 0.7,
    padding: 2,
  },
})
