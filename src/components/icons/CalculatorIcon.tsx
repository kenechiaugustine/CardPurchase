import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IconProps {
  color: string;
  size: number;
}

const CalculatorIcon: React.FC<IconProps> = ({ color, size }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x="4" y="2" width="16" height="20" rx="2" ry="2"></Rect>
      <Path d="M8 6h8"></Path>
      <Path d="M8 12h8"></Path>
      <Path d="M8 18h8"></Path>
    </Svg>
  );
};

export default CalculatorIcon;
