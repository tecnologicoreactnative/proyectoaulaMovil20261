import React from 'react'
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native'

// Horizontal scrollable chips for categories
export default function CategoryFilter({ categories = [], selected = '', onSelect = () => {} }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const active = cat === selected
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#6200EE', // primary color
  },
  chipText: {
    color: '#111',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
})
