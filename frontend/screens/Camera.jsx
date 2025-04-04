import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Avatar } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { colors } from "../styles/styles";

const MyIcon = ({ icon, handler }) => (
  <TouchableOpacity onPress={handler} style={styles.iconButton}>
    <Avatar.Icon
      icon={icon}
      size={40}
      style={{ backgroundColor: colors.color5 }}
      color={colors.color2}
    />
  </TouchableOpacity>
);

const CameraComponent = ({ navigation, route }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.status !== 'granted') {
      Alert.alert("Permission required", "You need to grant gallery permissions to select an image");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const imageUri = result.assets ? result.assets[0].uri : result.uri;
      
      // Navigate based on route params
      if (route.params?.newProduct) {
        navigation.navigate("newproduct", { image: imageUri });
      } else if (route.params?.updateProduct) {
        navigation.navigate("productimages", { image: imageUri });
      } else if (route.params?.updateProfile) {
        navigation.navigate("profile", { image: imageUri });
      } else {
        navigation.navigate("signup", { image: imageUri });
      }
    }
  };

  const clickPicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      
      // Navigate based on route params
      if (route.params?.newProduct) {
        navigation.navigate("newproduct", { image: photo.uri });
      } else if (route.params?.updateProduct) {
        navigation.navigate("productimages", { image: photo.uri });
      } else if (route.params?.updateProfile) {
        navigation.navigate("profile", { image: photo.uri });
      } else {
        navigation.navigate("signup", { image: photo.uri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image");
      console.error(error);
    }
  };

  const handleFlip = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Check if permission is still loading
  if (!permission) {
    return <View style={styles.loader}><Text>Requesting camera permission...</Text></View>;
  }

  // Check if permission is not granted
  if (!permission.granted) {
    return (
      <View style={styles.denied}>
        <Text>Camera access denied. Please enable camera permissions.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonsContainer}>
          <MyIcon icon="image" handler={openImagePicker} />
          <MyIcon icon="camera" handler={clickPicture} />
          <MyIcon icon="camera-flip" handler={handleFlip} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.color1,
  },
  camera: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    width: "100%",
    justifyContent: "space-evenly",
  },
  iconButton: {
    backgroundColor: colors.color1,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  denied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionButton: {
    backgroundColor: colors.color1,
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  permissionButtonText: {
    color: colors.color2,
    fontWeight: 'bold',
  }
});

export default CameraComponent;