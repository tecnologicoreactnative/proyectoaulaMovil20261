import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // HEADER
  header: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },

  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backArrow: {
    fontSize: 26,
    color: colors.primaryLight,
    fontWeight: '300',
    lineHeight: 28,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 10,
  },

  headerTitleWrap: {
    flex: 1,
  },

  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  headerSubtitle: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 2,
    opacity: 0.8,
  },

  // STEPS BAR
  stepsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 6,
    backgroundColor: colors.primaryDark,
  },

  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(232,201,160,0.3)',
  },

  stepDotActive: {
    backgroundColor: colors.primaryLight,
    flex: 2,
  },

  // SCROLL
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // VER MIS SOLICITUDES
  myRequestsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  myRequestsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  myRequestsIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  myRequestsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },

  myRequestsArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },

  // STEP TITLES
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textLight,
    marginBottom: 4,
  },

  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
    marginBottom: 20,
  },

  // PET CARDS
  petList: {
    gap: 10,
    marginBottom: 24,
  },

  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  petCardSelected: {
    borderColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },

  // Solo cuadro de color, sin emoji
 petAvatar: {
  width: 52,
  height: 52,
  borderRadius: 16,
  overflow: 'hidden', // ← agrega esta línea
},

  petInfo: {
    flex: 1,
  },

  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },

  petBreed: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '400',
  },

  petCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  petCheckSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  petCheckMark: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // INPUTS
  inputGroup: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: colors.textLight,
    marginBottom: 8,
  },

  input: {
    width: '100%',
    padding: 14,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    fontSize: 15,
    color: colors.text,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  textArea: {
    height: 120,
    paddingTop: 14,
  },

  // BOTÓN PRINCIPAL
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  primaryBtnArrow: {
    color: colors.primaryLight,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },

  // ATRÁS
  backLinkWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },

  backLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryDark,
  },
});