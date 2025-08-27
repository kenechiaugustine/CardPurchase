import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color: string;
  size: number;
}

const PricesIcon: React.FC<IconProps> = ({ color, size }) => {
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
      <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></Path>
      <Path d="M7 7h.01"></Path>
    </Svg>
  );
};

export default PricesIcon;
