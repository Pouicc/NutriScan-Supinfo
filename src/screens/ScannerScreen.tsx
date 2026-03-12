/**
 * Écran Scanner
 * Ouvre la caméra et détecte automatiquement les codes-barres
 * Effectue une requête vers Open Food Facts dès détection
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProductByBarcode } from '../utils/api';
import { ScannerStackParamList } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';

type NavigationProp = NativeStackNavigationProp<ScannerStackParamList, 'Scanner'>;

const ScannerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation du cadre de scan
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      const result = await fetchProductByBarcode(data);

      if (!result) {
        setError('Produit non trouvé dans la base Open Food Facts.');
        setLoading(false);
        return;
      }

      // Naviguer vers la fiche produit
      navigation.navigate('ProductDetail', { barcode: data, product: result });
    } catch (err) {
      setError('Erreur réseau. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setError(null);
  };

  // Permission en cours de chargement
  if (!permission) {
    return <LoadingIndicator fullscreen message="Chargement..." />;
  }

  // Permission refusée
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Accès caméra requis</Text>
        <Text style={styles.permissionMessage}>
          NutriScan a besoin d'accéder à votre caméra pour scanner les codes-barres des produits alimentaires.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay sombre avec cadre de scan */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scanner un produit</Text>
          <Text style={styles.headerSubtitle}>Placez le code-barres dans le cadre</Text>
        </View>

        <Animated.View
          style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </Animated.View>

        <View style={styles.bottomArea}>
          {loading && (
            <View style={styles.loadingBox}>
              <LoadingIndicator message="Recherche du produit..." />
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={resetScanner}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={resetScanner}
              activeOpacity={0.7}
            >
              <Text style={styles.rescanButtonText}>Scanner à nouveau</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.8,
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    minHeight: 100,
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  errorText: {
    color: '#F87171',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  rescanButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  rescanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Permission
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ScannerScreen;
