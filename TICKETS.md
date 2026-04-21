# Tickets de Desarrollo - Proyecto Biblioteca

Este documento define los tickets de trabajo desde el **Segundo Entregable** hasta el **Tercer Entregable**. Cada ticket incluye descripción, criterios de aceptación, notas técnicas de implementación y archivos a crear/modificar, siguiendo la arquitectura y convenciones del proyecto.

---

## Tabla de Contenidos

- [Segundo Entregable](#segundo-entregable)
  - [T2-01: Pantalla Mis Préstamos](#t2-01)
  - [T2-02: Estados de Préstamo Visibles](#t2-02)
  - [T2-03: Cancelación de Solicitud](#t2-03)
  - [T2-04: Búsqueda de Libros](#t2-04)
  - [T2-05: Filtros por Categoría/Autor](#t2-05)
  - [T2-06: Campos Adicionales en Registro](#t2-06)
- [Tercer Entregable](#tercer-entregable)
  - [T3-01: Panel de Gestión de Libros (Admin)](#t3-01)
  - [T3-02: Edición de Libros Existentes](#t3-02)
  - [T3-03: Carga de Portada (Storage)](#t3-03)
  - [T3-04: Gestión de Estados de Préstamo (Admin)](#t3-04)
  - [T3-05: Historial de Préstamos con Filtros](#t3-05)

---

## Segundo Entregable

### T2-01: Pantalla Mis Préstamos

**Descripción**
- Crear una nueva pantalla que muestre exclusivamente los préstamos del usuario autenticado.
- Debe listar cada préstamo con información mínima: título del libro, portada (pequeña), estado, fecha de solicitud.
- Navegación desde el menú lateral (Drawer) y opcionalmente desde la pantalla principal.

**Criterios de aceptación**
- El usuario ve solo sus préstamos (filtrados por `userId`).
- Cada ítem muestra: portada (si existe), título, estado (etiqueta con color), fecha.
- Pull-to-refresh para actualizar lista.
- Empty state cuando no hay préstamos.
- Navegación funcional a detalles del libro (reutilizar `Details`).

**Notas técnicas**
- Hook: Reutilizar `useLoans(user.uid)` (ya existe).
- Componente: Crear `components/Loan/LoanItem.js` para renderizar cada préstamo.
- Pantalla: `screens/MyLoans.js` que usa un `FlatList` de `LoanItem`.
- Agregar ruta en `navigation/DrawerNavigator.js`:
  - Nombre: "MisPréstamos", componente: `MyLoans`.
- Estilos: Mantener consistencia con `colors.js` (ej. colores por estado: verde=disponible, amarillo=solicitado, azul=entregado, gris=devuelto).
- Estado: Ya `useLoans` retorna `loans` ordenados por fecha descendente (ordenar por `requestedAt`).
- Fecha: Formatear con `Intl.DateTimeFormat` o librería `date-fns` (no añadir dependencia nueva, usar método nativo).

**Archivos a crear/modificar**
- `components/Loan/LoanItem.js` (nuevo)
- `screens/MyLoans.js` (nuevo)
- `navigation/DrawerNavigator.js` (agregar screen)

---

### T2-02: Estados de Préstamo Visibles

**Descripción**
- Mostrar claramente el estado del préstamo en todas las vistas relevantes: detalle de libro, lista de mis préstamos, panel admin.
- Estados: `solicitado`, `aprobado`, `entregado`, `devuelto`.
- Cada estado debe tener un color, ícono o etiqueta distinguishable.

**Criterios de aceptación**
- En detalle de libro: indicador visual del estado actual (badge con fondo de color y texto).
- En Mis Préstamos: badge por ítem.
- En panel admin (tercer entregable): badge y opciones condicionales según estado.
- El mapping estado→color es consistente en toda la app.

**Notas técnicas**
- Crear `components/Common/StatusBadge.js`:
  - Props: `status` (string), `style` (opcional).
  - Internamente mapear: solicitado→`#F59E0B` (amarillo), aprobado→`#3B82F6` (azul), entregado→`#10B981` (verde), devuelto→`#9CA3AF` (gris).
  - Texto: capitalizar primera letra.
- Reutilizar en:
  - `components/Book/BookDetails.js` (ya existe Detalle, agregar StatusBadge).
  - `components/Loan/LoanItem.js`.
- Documentar en `components/index.js` exportar `StatusBadge`.

**Archivos a crear/modificar**
- `components/Common/StatusBadge.js` (nuevo)
- `components/index.js` (agregar export)
- `components/Book/BookDetails.js` (usar)
- `components/Loan/LoanItem.js` (usar)

---

### T2-03: Cancelación de Solicitud

**Descripción**
- Permitir al usuario cancelar una solicitud de préstamo mientras su estado sea `solicitado`.
- No permitir cancelar si ya fue aprobado/entregado/devuelto.
- Confirmar con diálogo antes de eliminar.

**Criterios de aceptación**
- En Mis Préstamos, cada ítem con estado `solicitado` muestra botón/icono Cancelar.
- Al presionar, alerta de confirmación (“¿Cancelar solicitud?”).
- Si confirma, se elimina el documento de préstamo de Firestore y se actualiza la UI.
- Si el préstamo no es cancelable, el botón está deshabilitado u oculto.
- Después de cancelar, la lista se actualiza automáticamente (onSnapshot ya lo hace).

**Notas técnicas**
- En `useLoans.js` ya existe `cancelLoan(loanId)`. Verificar que use `deleteDoc`.
- En `LoanItem.js`:
  - Mostrar botón solo si `status === 'solicitado'`.
  - Botón: `PrimaryButton` con título “Cancelar” y estilo de Peligro (usar color `error` de `colors.js`).
  - `onPress`: `Alert.alert` con dos botones (Cancelar/Confirmar). Si confirma → `cancelLoan(id)`.
- No olvidar desuscribirse correctamente en `useLoans` (ya implementado con onSnapshot).

**Archivos a modificar**
- `components/Loan/LoanItem.js` (agregar botón condicional)

---

### T2-04: Búsqueda de Libros

**Descripción**
- Agregar una barra de búsqueda en la pantalla principal (Home) que filtre libros por título (y opcionalmente autor) en tiempo real.
- La búsqueda debe ser client-side (sobre la lista ya cargada).

**Criterios de aceptación**
- Input de búsqueda visible en Home, arriba del listado (puede estar en `HomeHeader` o como parte de `FlatList` header).
- Al escribir, la lista se filtra instantáneamente por título (case-insensitive).
- Cuando la caja está vacía, se muestran todos los libros.
- El botón de limpiar (X) borra el texto y restablece la lista.
- Se mantiene la responsividad (columnas) y pull-to-refresh.

**Notas técnicas**
- En `HomeContent.js`:
  - Agregar `const [searchQuery, setSearchQuery] = useState('')`.
  - Filtrar: `const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()))`.
  - Usar `filteredBooks` como `data` del `FlatList`.
- Componente de Input: Crear `components/Common/SearchInput.js`:
  - `TextInput` con icono de lupa a la izquierda y botón X a la derecha cuando hay texto.
  - Estilos: borde redondeado, padding, color de fondo `surfaceAlt`.
- Posición: Poner dentro de `ListHeaderComponent` antes de `HomeHeader` o dentro de `HomeHeader` si se decide.
- Alternativa: Pasar `searchQuery` como prop a `HomeHeader` y que `HomeHeader` renderice el input. Mejor: mantener lógica en `HomeContent` y pasar `searchQuery` y `setSearchQuery` a `HomeHeader` para que renderice el input (evitar que `HomeContent` renderice UI del header).
- Decisión: modificar `HomeHeader` para aceptar `searchQuery` y `onSearchChange` y renderizar el input. Así separamos responsabilidad: `HomeContent` maneja estado, `HomeHeader` renderiza.

**Archivos a modificar**
- `components/Home/HomeContent.js` (estado y filtro)
- `components/HomeHeader.js` (añadir props e input)
- `components/Common/SearchInput.js` (nuevo, opcional)

---

### T2-05: Filtros por Categoría/Autor

**Descripción**
- Permitir filtrar libros por categoría (o por autor) desde la pantalla principal.
- Implementar una hilera de botones/chips de categorías disponibles, extraídas dinámicamente de los libros.

**Criterios de aceptación**
- Se extraen categorías únicas de los libros (ignorando vacías).
- Se muestran como botones/chips alineados horizontalmente (scroll si many).
- Al seleccionar una categoría, se filtra la lista; al seleccionar “Todas”, se muestran todos.
- El filtro se combina con la búsqueda: si hay texto de búsqueda y categoría seleccionada, ambos filtros aplican.

**Notas técnicas**
- En `HomeContent.js`:
  - `const categories = useMemo(() => ['Todas', ...new Set(books.map(b => b.category).filter(Boolean))], [books]);`
  - `const [selectedCategory, setSelectedCategory] = useState('Todas');`
  - Filtrar: `books.filter(b => (selectedCategory==='Todas' || b.category===selectedCategory) && (match searchQuery))`.
- Crear `components/Common/CategoryFilter.js`:
  - Props: `categories` (array), `selected` (string), `onSelect` (function).
  - Renderizar `ScrollView` horizontal con botones estilo `chips`.
  - Estilo activo: fondo `primary`, texto `surface`; inactivo: fondo `surfaceAlt`, texto `text`.
- Colocar este componente en `ListHeaderComponent` debajo del search.
- Asegurar que `HomeContent` pasa `categories` y `selectedCategory`/`onSelect` a `HomeHeader` o lo renderice directamente. Dado que `HomeHeader` ya tendrá responsabilidad de header con avatar y menú, mejor crear un `HomeFilters` aparte y ponerlo también en el header del FlatList.
- Decisión: modificar `HomeHeader` para que reciba `searchQuery`, `onSearchChange`, `categories`, `selectedCategory`, `onCategorySelect` y renderice tanto input como chips. Así `HomeHeader` es presentación pura.

**Archivos a modificar**
- `components/Home/HomeContent.js` (lógica de filtros)
- `components/HomeHeader.js` (añadir props y UI de filtros)
- `components/Common/CategoryFilter.js` (nuevo, o integrar en HomeHeader)

---

### T2-06: Campos Adicionales en Registro

**Descripción**
- Ampliar el formulario de registro para incluir nombre, apellido y fecha de nacimiento o edad.
- Estos datos deben almacenarse en el documento del usuario en Firestore (colección `users`).

**Criterios de aceptación**
- La pantalla de registro muestra campos adicionales: Nombre, Apellido, Fecha de nacimiento (o Edad).
- Todos los campos son obligatorios (excepto si se decide que algunos son opcionales).
- Al registrarse, se crea el documento del usuario en Firestore con todos los datos, incluyendo el campo `role` por defecto `'user'`.
- Los datos pueden editarse posteriormente en una pantalla de “Perfil” (opcional para este entregable).
- Validaciones: nombre/apellido no vacíos, fecha válida, edad > 0 y < 120.

**Notas técnicas**
- Modificar `components/Auth/RegisterForm.js`:
  - Añadir estados: `firstName`, `lastName`, `birthDate` (formato ISO string YYYY-MM-DD) o `age` (number). Se recomienda `birthDate` porque es más preciso y permite calcular edad.
  - Añadir `TextInput` para cada campo con estilos consistentes.
  - En `handleSignUp`, pasar `{ email, password, firstName, lastName, birthDate }` a `signUp`.
- Hook `useAuthActions.signUp`:
  - Actualmente solo registra en Firebase Auth. Debe extenderse para crear documento en `users/{uid}` con todos los campos y `role: 'user'`.
  - Crear función `createUserDocument(uid, userData)` que guarde en Firestore. Llamarla después de `createUserWithEmailAndPassword`.
  - Estructura documento: `{ uid, email, firstName, lastName, birthDate, role: 'user', createdAt: serverTimestamp() }`.
- Modificar `AuthContext` para incluir `firstName`, `lastName`, `birthDate` en el objeto de usuario que provee el contexto, de modo que estén disponibles en toda la app.
- Validaciones cliente:
  - Nombre/apellido: al menos 2 caracteres, solo letras y espacios.
  - Fecha: usar `DatePicker` nativo o simple `TextInput` con máscara YYYY-MM-DD. Validar que sea una fecha válida y que la edad esté en rango (ej. 5-120 años).
- Sugerencia: crear hook `useUserForm` para reutilizar validaciones entre Login y Register, pero no obligatorio.

**Archivos a crear/modificar**
- `components/Auth/RegisterForm.js` (añadir campos y validación)
- `hooks/useAuthActions.js` (crear documento usuario con datos extendidos)
- `contexts/AuthContext.js` (exponer datos adicionales del usuario)
- `screens/Profile.js` (opcional: editar perfil, para otro entregable)

---

## Tercer Entregable

### T3-01: Panel de Gestión de Libros (Admin)

**Descripción**
- Pantalla exclusiva para usuarios con rol `admin` que permita ver listado completo de libros y agregar nuevos.
- Incluir botón “Nuevo Libro” que navegue a formulario de creación (reutilizar `AddBook` modificado para admin).
- Solo accesible si el usuario tiene rol admin.

**Criterios de aceptación**
- El admin ve todos los libros de la biblioteca (sin filtrar por usuario).
- Lista similar a Home pero sin distinción de propietario.
- Botón flotante (+ ) visible para agregar nuevo libro.
- Si un usuario sin rol admin intenta acceder, se redirige o muestra mensaje de “Acceso denegado”.
- La navegación a agregar libro funciona y guarda correctamente.

**Notas técnicas**
- Hook: Usar `useBooks()` actual, que ya trae todos los libros (no filtra por userId).
- Modificar `AddBook` para que funcione tanto para admin como para usuario normal. No hay cambio funcional, solo que admin también puede usarlo.
- Nueva pantalla: `screens/Admin/ManageBooks.js`:
  - Renderiza un componente `BookListAdmin` similar a `HomeContent` pero sin usuario asociado. Reutilizar lógica de `HomeContent` creando un componente genérico `BookList` que reciba `books`, `onBookPress`, `showAddButton`.
  - O simplemente copiar `HomeContent` y adaptar (sin FAB? sí con FAB para agregar).
- Protección de ruta: En `DrawerNavigator.js`, agregar nueva ruta `"AdminBooks"` pero envolver en un componente `AdminRouteGuard` que verifique `user.role === 'admin'`. Si no, navegar a Home.
- Para obtener el rol, AuthContext debe incluir `user.role`. Ver ticket T3-R1 (infraestructura roles).

**Archivos a crear/modificar**
- `screens/Admin/ManageBooks.js` (nuevo)
- `navigation/DrawerNavigator.js` (agregar ruta)
- `contexts/AuthContext.js` (ampliar para incluir rol) – ver T3-R1
- `components/Home/HomeContent.js` (posible refactor a genérico)

---

### T3-02: Edición de Libros Existentes

**Descripción**
- Permitir al admin editar cualquier libro existente: modificar título, autor, categoría, descripción, y portada.
- Navegación desde ManageBooks: cada ítem debe tener botón “Editar”.
- El formulario de edición debe precargar datos actuales y permitir guardar cambios.

**Criterios de aceptación**
- En ManageBooks, cada libro muestra un icono/botón de editar.
- Al presionar, navega a `EditBook` (pantalla similar a AddBook pero con datos precargados).
- Se puede modificar todos los campos y subir nueva portada (reemplaza en Storage y actualiza URL en Firestore).
- Al guardar, los cambios se reflejan en Firestore y la lista se actualiza automáticamente (onSnapshot).
- Validaciones: título y autor obligatorios.

**Notas técnicas**
- Reutilizar el componente `BookForm` que ya existe para AddBook. Modificarlo para que acepte un prop `initialData` y un modo "edit".
- Hook `useBooks`: ya tiene `addBook`. Necesitamos una función `updateBook(id, data, imageUri)` que actualice documento en Firestore y, si hay imagen nueva, suba a Storage y actualice `image` y `imagePath`.
- En `useBooks.js`:
  - Añadir `updateBook`:
    - `setDoc(doc(db, 'books', id), { ...data, updatedAt: serverTimestamp() }, { merge: true })`
    - Si hay imageUri, subir a Storage y actualizar campos `image`, `imagePath`.
    - Mantener `onSnapshot` para actualizar UI.
- Pantalla `screens/Admin/EditBook.js`:
  - Obtener `bookId` de route.params.
  - Buscar libro en `books` hook o cargar por `doc(db, 'books', id).get()`.
  - Pasar `initialData` a `BookForm` con prop `initialData` y `onSubmit`.
- `BookForm`:
  - Recibir `initialData` y `onSubmit`.
  - Si `initialData` existe, llenar estados iniciales.
  - Usar misma lógica de subida de imagen que en `addBook` del hook ¿pero en el hook ya distinguimos? En `useBooks.addBook` ya sube imagen; haremos que `updateBook` haga similar.
- Navegación: En ManageBooks, al presionar editar: `navigation.navigate('EditBook', { bookId })`.

**Archivos a crear/modificar**
- `hooks/useBooks.js` (añadir updateBook)
- `screens/Admin/EditBook.js` (nuevo)
- `components/home/book-form.js` (aceptar initialData y modo edit)
- `navigation/DrawerNavigator.js` (agregar ruta EditBook si es necesario, o navegar como modal)

---

### T3-03: Carga de Portada (Storage) – Ya Implementada

**Descripción**
- Esta funcionalidad ya está implementada en `BookForm` y `useBooks` usando Cloudinary y Firebase Storage.
- Se documenta aquí para verificar cumplimiento y ajustes menores si es necesario.

**Verificación de criterios**
- El formulario de agregar/editar permite seleccionar imagen (cámara o galería).
- La imagen se sube a Cloudinary (o Firebase Storage) y se guarda la URL en el documento del libro.
- La portada se visualiza correctamente en listado y detalle.

**Notas técnicas**
- `useCloudinary` (cloud uploading) está集成ado en `useBooks.addBook`.
- Para edición, se implementará `updateBook` similar.
- Asegurar que al editar sin cambiar imagen, no se elimine la anterior.

**Archivos a revisar**
- `hooks/useCloudinary.js`
- `hooks/useBooks.js` (método addBook)
- `components/home/book-form.js`

---

### T3-04: Gestión de Estados de Préstamo (Admin)

**Descripción**
- Permitir al admin cambiar el estado de cualquier préstamo: de `solicitado` a `aprobado`, de `aprobado` a `entregado`, de `entregado` a `devuelto`.
- También poder revertir o anular (eliminar) préstamos.

**Criterios de aceptación**
- En panel admin (nueva pantalla “Gestión de Préstamos”), se listan todos los préstamos con filtros por estado y usuario.
- Cada ítem muestra libro, usuario (email), estado actual, y acciones disponibles según estado:
  - Si `solicitado`: botones “Aprobar” (pasa a aprobado) y “Rechazar” (elimina).
  - Si `aprobado`: botón “Marcar Entregado”.
  - Si `entregado`: botón “Marcar Devuelto”.
  - Si `devuelto`: solo info, sin acciones.
- Las acciones actualizan Firestore y la UI recarga automáticamente.

**Notas técnicas**
- Hook: `useLoans` ya puede traer todos los préstamos si se llama sin `userId`. Actualmente está definido `useLoans(userId)` pero si `userId` es undefined/ null, debería traer todos. Verificar implementación. Si no, modificar para aceptar `null` para admin.
- Pantalla: `screens/Admin/LoansManagement.js`:
  - Usar FlatList con `LoanAdminItem` componente.
  - Incluir filtros: por estado (dropdown) y por usuario (search por email).
- Componente: `components/Admin/LoanAdminItem.js`:
  - Muestra info + botones condicionales.
  - Al presionar acción, confirmar con Alert y luego llamar `updateLoanStatus` o `cancelLoan`.
- `useLoans` ya tiene `updateLoanStatus` y `cancelLoan`. Usarlos.
- ConsiderarFirestore security rules para que solo admin pueda modificar préstamos (pero eso es backend, no se implementa en app).
- Opcional: mostrar email del usuario: se necesita obtener `users` colección. Asumiendo que existe documentos `/users/{uid}` con email. O traer el email desde `auth` (el uid) pero no está en préstamo. Podríamos traer datos del usuario con `getAuth().getUser(uid)` no en client. Simplificar: mostrar soloUID o no mostrarlo.

**Archivos a crear/modificar**
- `hooks/useLoans.js` (ajustar para traer todos si userId null)
- `screens/Admin/LoansManagement.js` (nuevo)
- `components/Admin/LoanAdminItem.js` (nuevo)
- `navigation/DrawerNavigator.js` (agregar ruta admin)
- `contexts/AuthContext.js` (añadir rol admin)

---

### T3-05: Historial de Préstamos con Filtros

**Descripción**
- En la sección “Mis Préstamos”, agregar capacidad de filtrar por estado (activos, completados) y ordenar por fecha.

**Criterios de aceptación**
- Dos pestañas/segmentos: “Activos” (solicitado, aprobado, entregado) y “Historial” (devuelto).
- O filtro por estado múltiple checkboxes.
- Opción de ordenar por fecha (más reciente/ más antiguo).
- Al aplicar filtros, la lista se actualiza automáticamente.

**Notas técnicas**
- En `HomeContent` (pero ahora en `MyLoans`), agregar `filterTab` state: 'active' | 'history' o `selectedStatus` array.
- Filtrar `loans` según criterios:
  - Activos: status in ['solicitado','aprobado','entregado']
  - Historial: status == 'devuelto'
- O implementar múltiples checkboxes usando `selectedStatus` Set.
- Para orden: `useMemo` para ordenar por `requestedAt` ASC/DESC.
- UI: Crear `components/Common/SegmentedControl.js` o usar botones simples.
- Pasa ya tenemos filtro por categoría en Home; reutilizar patrón similar.

**Archivos a modificar**
- `screens/MyLoans.js` (añadir filtros)
- `components/Loan/LoanItem.js` (ya existe)

---

## Tickets de Infraestructura

### T3-R1: Implementar Roles de Usuario (Admin/User)

**Descripción**
- Agregar concepto de roles en la aplicación para restringir funcionalidades de administrador.
- Cada usuario debe tener un campo `role` en su documento de Firestore (colección `users`).
- Al iniciar sesión, `AuthContext` debe cargar el rol y exponerlo en el contexto (`user.role`).

**Criterios de aceptación**
- Al registrarse, se crea documento en `users/{uid}` con `{ email, role: 'user' }`.
- Un admin manualmente (desde consola Firebase) puede cambiar el rol a `'admin'` de cierto usuario.
- Al login/refresh, el contexto carga el rol desde Firestore.
- Si `user.role === 'admin'`, el menú lateral muestra opciones de gestión (AdminBooks, AdminLoans).
- Rutas protegidas: se redirige si no tiene rol necesario.

**Notas técnicas**
- En `firebase.js`, ya tenemos `db`.
- Crear función `createUserDocument(uid, email)` que se llame después del registro (en `useAuthActions.signUp`).
- En `AuthContext`, al montar el provider, suscribirse a cambios del documento de usuario (onSnapshot) para mantener `role` actualizado.
- Agregar `role` al estado de usuario: `{ user: { uid, email, role } }`.
- En `DrawerNavigator`, condicionar rutas admin: `{ role === 'admin' && <Drawer.Screen name="AdminBooks" ... /> }`
- También agregar ítems en el `HomeHeader` o menú (MenuModal) solo para admin.

**Archivos a modificar**
- `hooks/useAuthActions.js` (crear doc usuario)
- `contexts/AuthContext.js` (cargar rol)
- `navigation/DrawerNavigator.js` (condicional)
- `components/HomeHeader.js` (mostrar menú admin)
- `components/MenuModal.js` (opciones admin)

---

## Checklist de Finalización

- [x] T2-01: Pantalla Mis Préstamos implementada y navegable
- [x] T2-02: Estados de préstamo con badge visible en todas las vistas
- [ ] T2-03: Cancelación de solicitud funcionando
- [ ] T2-04: Búsqueda de libros implementada
- [ ] T2-05: Filtros por categoría implementados
- [x] T2-06: Campos adicionales en registro (nombre, apellido, fecha nacimiento)
- [ ] T3-R1: Roles de usuario implementados y cargados en contexto
- [ ] T3-01: Panel de gestión de libros (admin) con listado y botón agregar
- [ ] T3-02: Edición de libros funcionando
- [ ] T3-03: Carga de portada verificada (ya existente)
- [ ] T4-04: Gestión de estados de préstamo para admin
- [ ] T3-05: Historial con filtros en Mis Préstamos

---

## Convenciones Técnicas a Seguir

- **Componentes**: Siempre funcionales, sin lógica de negocio compleja; la lógica vive en hooks.
- **Hooks**: Responsabilidad única, nombres con prefijo `use*`, manejo de loading/error.
- **Estilos**: Usar `StyleSheet.create` cuando sea complejo; colores desde `colors.js`.
- **Navegación**: Usar React Navigation v7; agregar rutas en `DrawerNavigator.js`.
- **Firebase**: Operaciones async con try/catch; usar `serverTimestamp` para fechas; `onSnapshot` para reactive UI.
- **Seguridad**: Validar entradas; no hardcodear API keys; usar variables de entorno para Cloudinary/Firebase (ya configurado en `babel.config.js`).

---

Documento final. Los tickets priorizan T2 completo, luego T3-R1 (roles) y finalmente T3-01 a T3-05.
