import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState, useRef } from "react";

interface CommissionAmountProps {
  amount: number;
  soundEnabled?: boolean;
}

export const CommissionAmount: React.FC<CommissionAmountProps> = ({ amount, soundEnabled = true }) => {
  const [animate, setAnimate] = useState(false);
  const [flashColor, setFlashColor] = useState("inherit");
  const prevAmount = useRef<number>(amount);

  useEffect(() => {
    if (prevAmount.current !== amount) {
      // 音声再生＆フラッシュカラー設定
      if (soundEnabled) {
        if (amount > prevAmount.current) {
          const audio = new Audio("/sounds/charin.mp3");
          audio.play();
          setFlashColor("green");
        } else if (amount < prevAmount.current) {
          const audio = new Audio("/sounds/damage.mp3");
          audio.play();
          setFlashColor("red");
        }
      } else {
        // サウンドが無効の場合も色変更だけ行う
        setFlashColor(amount > prevAmount.current ? "green" : "red");
      }
      
      setAnimate(true);
      const timeoutAnimate = setTimeout(() => setAnimate(false), 150);
      const timeoutColor = setTimeout(() => setFlashColor("inherit"), 200);
      prevAmount.current = amount;
      return () => {
        clearTimeout(timeoutAnimate);
        clearTimeout(timeoutColor);
      };
    }
  }, [amount, soundEnabled]);

  const shakeKeyframes = keyframes`
    0% { transform: translate(5px, -4px); }
    12% { transform: translate(-6px, 3px); }
    24% { transform: translate(5px, -4px); }
    36% { transform: translate(-4px, 5px); }
    48% { transform: translate(6px, -3px); }
    60% { transform: translate(-5px, 4px); }
    72% { transform: translate(4px, -5px); }
    84% { transform: translate(-3px, 6px); }
    96% { transform: translate(5px, -4px); }
    100% { transform: translate(0, 0); }
  `;

  return (
    <Box display="inline-block" animation={animate ? `${shakeKeyframes} 0.5s` : undefined}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        style={{ transition: "color 0.3s ease-out", color: flashColor }}
      >
        現在の金額: {amount.toLocaleString()} 円
      </Text>
    </Box>
  );
};