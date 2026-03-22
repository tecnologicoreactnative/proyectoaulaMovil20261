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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { GradientButton, Heading, Body } from "..";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../colors";

export default function BookForm({ onAdd }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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
    setSubmitting(true);
    try {
      await onAdd(
        { title, author, description, category, available },
        image ? image.base64 : null,
      );
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
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
      contentContainerStyle={[
        styles.container,
        { paddingBottom: 24 + insets.bottom + 8 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Heading style={styles.title}>Agregar libro</Heading>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          placeholder="Título del libro"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Autor *</Text>
        <TextInput
          placeholder="Autor del libro"
          value={author}
          onChangeText={setAuthor}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoría</Text>
        <TextInput
          placeholder="Ej: Ficción, Ciencia, Novela"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Describe el libro"
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
            { color: remainingChars < 0 ? colors.error : colors.textMuted },
          ]}
        >
          {remainingChars} caracteres restantes
        </Text>
      </View>

      <View style={styles.row}>
        <Body style={styles.rowLabel}>Disponible para intercambio</Body>
        <View style={styles.switchContainer}>
          <Body style={styles.switchLabel}>Sí</Body>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
          <Body style={styles.switchLabel}>No</Body>
        </View>
      </View>

      <View style={styles.imageSection}>
        <Text style={styles.label}>Imagen de portada</Text>
        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={styles.removeImageBtn}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No hay imagen</Text>
            </View>
          )}
          <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
            <Text style={styles.pickButtonText}>Elegir imagen</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GradientButton
        title={submitting ? "Guardando..." : "Guardar libro"}
        onPress={handleSubmit}
        disabled={submitting}
        style={styles.submitButton}
        textStyle={styles.submitButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: colors.text,
    fontFamily: "Poppins_400Regular",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    marginRight: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: colors.error,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderWidth: 2,
  },
  imagePlaceholderText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  pickButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  pickButtonText: {
    color: colors.surface,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  submitButton: {
    marginTop: 8,
    shadowColor: colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
  },
});
