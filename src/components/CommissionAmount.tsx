import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState, useRef } from "react";

interface CommissionAmountProps {
  amount: number;
  soundEnabled?: boolean;
}

export const CommissionAmount: React.FC<CommissionAmountProps> = ({
  amount,
  soundEnabled = true,
}) => {
  const [animate, setAnimate] = useState(false);
  const [flashColor, setFlashColor] = useState("inherit");
  const prevAmount = useRef<number>(amount);

  // 追加: 金額増減分用の状態
  const [delta, setDelta] = useState(0);
  // showDelta はアニメーション表示用のフラグ
  const [showDelta, setShowDelta] = useState(false);
  // キーを更新して、要素の再生成を促す
  const [deltaKey, setDeltaKey] = useState<number>(Date.now());

  useEffect(() => {
    if (prevAmount.current !== amount) {
      const diff = amount - prevAmount.current;

      // 音声再生＆フラッシュカラー設定
      if (soundEnabled) {
        if (diff > 0) {
          const audio = new Audio("/sounds/charin.mp3");
          audio.play();
          setFlashColor("green");
        } else if (diff < 0) {
          const audio = new Audio("/sounds/damage.mp3");
          audio.play();
          setFlashColor("red");
        }
      } else {
        // サウンドが無効の場合も色変更だけ行う
        setFlashColor(diff > 0 ? "green" : "red");
      }
      
      setAnimate(true);
      // フラッシュアニメーションの解除
      const timeoutAnimate = setTimeout(() => setAnimate(false), 150);
      const timeoutColor = setTimeout(
        () => setFlashColor("inherit"),
        200
      );

      // 増減分表示用の状態更新
      setDelta(diff);
      // キーを更新して要素の再マウントを促す
      setDeltaKey(Date.now());
      setShowDelta(true);
      // 1.5秒後に増減分を非表示にする
      const timeoutDelta = setTimeout(() => setShowDelta(false), 1500);

      prevAmount.current = amount;
      return () => {
        clearTimeout(timeoutAnimate);
        clearTimeout(timeoutColor);
        clearTimeout(timeoutDelta);
      };
    }
  }, [amount, soundEnabled]);

  // 既存: 揺れるエフェクト
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

  // 追加: 浮かび上がりフェードアウトのアニメーション
  const floatKeyframes = keyframes`
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  `;

  return (
    <Box position="relative" display="inline-block">
      <Box animation={animate ? `${shakeKeyframes} 0.5s` : undefined}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          style={{ transition: "color 0.3s ease-out", color: flashColor }}
        >
          現在の金額: {amount.toLocaleString()} 円
        </Text>
      </Box>
      {showDelta && (
        <Text
          key={deltaKey}
          position="absolute"
          left="50%"
          top="-20px"
          transform="translateX(-50%)"
          fontSize="lg"
          fontWeight="bold"
          color={delta > 0 ? "green" : "red"}
          animation={`${floatKeyframes} 1.5s forwards`}
          userSelect="none"
        >
          {delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()}
        </Text>
      )}
    </Box>
  );
};