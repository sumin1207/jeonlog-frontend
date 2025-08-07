import React, { useState, useEffect } from 'react';
import { Image, Dimensions } from 'react-native';

interface AutoHeightImageProps {
  source: { uri: string } | number;
  imageWidth?: number;
}

const AutoHeightImage: React.FC<AutoHeightImageProps> = ({ source, imageWidth }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const screenWidth = imageWidth || Dimensions.get('window').width;
    
    // 로컬 이미지인 경우
    if (typeof source === 'number') {
      const asset = Image.resolveAssetSource(source);
      if (asset) {
        const aspectRatio = asset.width / asset.height;
        setWidth(screenWidth);
        setHeight(screenWidth / aspectRatio);
      }
      return;
    }

    // 원격 이미지인 경우
    if (source && source.uri) {
      Image.getSize(source.uri, (w, h) => {
        const aspectRatio = w / h;
        setWidth(screenWidth);
        setHeight(screenWidth / aspectRatio);
      }, (error) => {
        console.error(`Failed to get image size: ${error}`);
        // 에러 발생 시 기본 크기 설정
        setWidth(screenWidth);
        setHeight(screenWidth); // 1:1 비율로 기본 설정
      });
    }
  }, [source, imageWidth]);

  if (!width || !height) {
    return null; // 크기 계산 전에는 렌더링하지 않음
  }

  return (
    <Image 
      source={source} 
      style={{ width, height, marginBottom: 10 }} 
      resizeMode="contain" 
      resizeMethod="resize"
    />
  );
};

export default AutoHeightImage;
