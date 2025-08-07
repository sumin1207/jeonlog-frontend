import React, { useState } from "react";
import { Dimensions, Image } from "react-native";

interface AutoHeightImageProps {
  source: { uri: string } | number;
  imageWidth?: number;
}

const AutoHeightImage: React.FC<AutoHeightImageProps> = ({
  source,
  imageWidth,
}) => {
  const [height, setHeight] = useState(1);
  const screenWidth = imageWidth || Dimensions.get("window").width * 0.95;

  const handleLoad = (event: any) => {
    const { width: originalWidth, height: originalHeight } = event.nativeEvent;
    if (originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      const calculatedHeight = screenWidth / aspectRatio;
      setHeight(calculatedHeight);
    }
  };

  return (
    <Image
      source={source}
      style={{ width: screenWidth, height: height, marginBottom: 10 }}
      resizeMode='contain'
      onLoad={handleLoad}
    />
  );
};

export default AutoHeightImage;
