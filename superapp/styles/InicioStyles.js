import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({

  // ──────────────────────────────────────────────
  // 🏠 WELCOME CARD
  // ──────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#7A5C3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 8,
  },

  welcome: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3B2507',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  Text: {
    fontSize: 14,
    color: '#9C7E5E',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // ──────────────────────────────────────────────
  // 🔘 BOTONES
  // ──────────────────────────────────────────────
  btnPrimary: {
    marginTop: 12,
    backgroundColor: '#8B6B3F',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8B6B3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  btnSecondary: {
    marginTop: 10,
    backgroundColor: '#C68B3A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7A5C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // ──────────────────────────────────────────────
  // 🎮 JUEGO
  // ──────────────────────────────────────────────
  gameContainer: {
    marginTop: 20,
    height: 160,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  gameLabel: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 1,
    fontWeight: '600',
  },

  // ──────────────────────────────────────────────
  // estilos legacy (por si se usan en otra pantalla)
  // ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },

  emoji: {
    fontSize: 50,
    textAlign: 'center',
  },

  email: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 6,
    fontWeight: '500',
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 6,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 6,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  buttonDanger: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonDangerText: {
    color: colors.white,
    fontWeight: '700',
  },
});