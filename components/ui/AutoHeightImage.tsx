import React, { useState, useEffect } from "react";
import { Dimensions, Image } from "react-native";

interface AutoHeightImageProps {
  source: { uri: string } | number;
  imageWidth?: number;
}

const AutoHeightImage: React.FC<AutoHeightImageProps> = ({
  source,
  imageWidth,
}) => {
  // Start with a placeholder height to avoid layout jumps, 200 is a reasonable default.
  const [height, setHeight] = useState<number | undefined>(200);

  const screenWidth = imageWidth || Dimensions.get("window").width * 0.95;

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    const updateHeight = (w: number, h: number) => {
      if (isMounted && w > 0 && h > 0) {
        const aspectRatio = w / h;
        setHeight(screenWidth / aspectRatio);
      }
    };

    if (typeof source === 'number') {
      // This is a local asset from require().
      const asset = Image.resolveAssetSource(source);
      if (asset) {
        updateHeight(asset.width, asset.height);
      }
    } else if (source && source.uri) {
      // This is a remote image.
      Image.getSize(source.uri, updateHeight, (error) => {
        console.error(`[AutoHeightImage] Failed to get size for image ${source.uri}: ${error}`);
      });
    }

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [source, screenWidth]);

  return (
    <Image
      source={source}
      style={{ width: screenWidth, height: height, marginBottom: 10 }}
      resizeMode="contain"
    />
  );
};

export default AutoHeightImage;

