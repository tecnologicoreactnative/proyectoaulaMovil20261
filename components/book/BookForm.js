import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { colors } from "../colors";
import { CATEGORY_COLORS } from "../../constants/categoryColors";
import { PRESET_CATEGORIES } from "../../constants/presetCategories";
import { Modal } from "react-native";

// Styles for new category multi-select UI (dynamic values depend on color map)

export default function BookForm({ onAdd }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  // New: categories multi-select
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const maxDescriptionLength = 200;

  async function pickImage() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
      if (res.canceled || !res.assets || res.assets.length === 0) return;
      const uri = res.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      setImage({ uri, base64 });
    } catch (err) {
      console.error("pickImage", err);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Faltan campos", "Completa el título y el autor.");
      return;
    }
    if (!image) {
      Alert.alert("Imagen requerida", "Por favor añade una imagen de portada para el libro.");
      return;
    }
    setSubmitting(true);
    try {
      await onAdd(
        {
          title,
          author,
          description,
          categories: selectedCategories,
          category: selectedCategories[0] || "",
          available,
        },
        image ? image.base64 : null,
      );
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setSelectedCategories([]);
      setAvailable(true);
      setImage(null);
      Alert.alert("Éxito", "Libro agregado correctamente.");
    } catch (err) {
      Alert.alert("Error", "No se pudo agregar el libro.");
    } finally {
      setSubmitting(false);
    }
  }

  const remainingChars = maxDescriptionLength - description.length;

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 24 + insets.bottom + 8 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Ionicons name="book-add" size={24} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Agregar libro</Text>
        <Text style={styles.headerSubtitle}>
          Completa los datos del libro para añadirlo a la biblioteca
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="text" size={16} color={colors.primary} />
            <Text style={styles.label}>Título *</Text>
          </View>
          <TextInput
            placeholder="Título del libro"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Author */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="person" size={16} color={colors.primary} />
            <Text style={styles.label}>Autor *</Text>
          </View>
          <TextInput
            placeholder="Autor del libro"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Categories (multi-select) */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="pricetag" size={16} color={colors.primary} />
            <Text style={styles.label}>Categorías</Text>
          </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.multiSelectBtn}>
              <Text style={styles.multiSelectBtnText}>Seleccionar categorías</Text>
            </TouchableOpacity>
              {selectedCategories.length > 0 && (
                <View style={styles.selectedContainer}>
                  {selectedCategories.map((c) => (
                    <View key={c} style={[styles.selectedChip, { backgroundColor: CATEGORY_COLORS[c] || '#ccc' }]}> 
                      <Text style={styles.selectedChipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}
        </View>
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona categorías</Text>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {PRESET_CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  const color = CATEGORY_COLORS[cat] || '#888';
                  return (
                    <TouchableOpacity key={cat} onPress={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat) ? prev.filter((p) => p !== cat) : [...prev, cat]
                      );
                    }} style={[styles.modalChip, { backgroundColor: color, opacity: active ? 0.9 : 0.6 }]}>
                      <Text style={styles.modalChipText}>{cat}{active ? ' ✔' : ''}</Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                  <Text style={styles.modalBtnText}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                  <Text style={styles.modalBtnText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Description */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="document-text" size={16} color={colors.primary} />
            <Text style={styles.label}>Descripción</Text>
          </View>
          <TextInput
            placeholder="Describe el libro..."
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            maxLength={maxDescriptionLength}
            placeholderTextColor={colors.textMuted}
          />
          <Text
            style={[
              styles.charCount,
              { color: remainingChars < 20 ? colors.warning : colors.textMuted },
            ]}
          >
            {remainingChars} caracteres restantes
          </Text>
        </View>

        {/* Availability Toggle */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleInfo}>
            <View style={styles.toggleIcon}>
              <Ionicons 
                name={available ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={available ? colors.success : colors.error} 
              />
            </View>
            <View>
              <Text style={styles.toggleTitle}>Disponible</Text>
              <Text style={styles.toggleSubtitle}>
                {available ? "Los usuarios pueden solicitar este libro" : "El libro no está disponible actualmente"}
              </Text>
            </View>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>

      {/* Image Section */}
      <View style={styles.imageCard}>
        <View style={styles.labelRow}>
          <Ionicons name="image" size={16} color={colors.primary} />
          <Text style={styles.label}>Imagen de portada</Text>
        </View>
        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={styles.removeImageBtn}
              >
                <Ionicons name="close" size={16} color={colors.surface} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={pickImage} 
              style={styles.imagePlaceholder}
            >
              <Ionicons name="camera-outline" size={40} color={colors.textMuted} />
              <Text style={styles.imagePlaceholderText}>Toca para agregar imagen</Text>
            </TouchableOpacity>
          )}
          {image && (
            <TouchableOpacity onPress={pickImage} style={styles.changeImageBtn}>
              <Ionicons name="refresh" size={16} color={colors.primary} />
              <Text style={styles.changeImageText}>Cambiar imagen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color={colors.surface} size="small" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
            <Text style={styles.submitButtonText}>Guardar libro</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLight,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    marginTop: 4,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  imagePlaceholderText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
  changeImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.primary + "10",
    borderRadius: 10,
  },
  changeImageText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: 16,
  },
  // New styles for multi-select categories
  multiSelectBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  multiSelectBtnText: {
    color: colors.primary,
    fontWeight: "600",
  },
  selectedContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selectedChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  selectedChipText: {
    color: colors.surface,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalScroll: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    margin: 6,
  },
  modalChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  modalBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
