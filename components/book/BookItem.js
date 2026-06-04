import React from "react";
import BookCard from "./BookCard";

/**
 * BookItem — Adaptador que conecta el modelo de libro con BookCard.
 *
 * Extrae los datos del `item` y se los pasa al componente global BookCard.
 * Mantiene la misma API (item, navigation) para no romper callers existentes.
 */
export function BookItem({ item, navigation }) {
  const categories = Array.isArray(item.categories) && item.categories.length > 0
    ? item.categories
    : item.category
    ? [item.category]
    : [];

  return (
    <BookCard
      title={item.title}
      author={item.author}
      categories={categories}
      available={item.available}
      image={item.image}
      onPress={() => navigation.navigate("Details", { book: item })}
    />
  );
}

export default BookItem;
