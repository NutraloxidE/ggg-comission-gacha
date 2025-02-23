import React from 'react';
import { Box, Flex, Text, Circle, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface StepsHeaderProps {
  steps: string[];
  currentStep: number; // 0インデックス：ステップ1から始まる
}

export const StepsHeader: React.FC<StepsHeaderProps> = ({ steps, currentStep }) => {
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  // SideMenu.tsx の幅に合わせたマージン
  const leftMargin = isLargerThanThatSize ? "200px" : "75px";
  const router = useRouter();
  const background = useColorModeValue("white", "gray.800");

  // クリックしたステップが現在より前（小さいインデックス）なら、ページを戻る
  const handleStepClick = (index: number) => {
    if (index < currentStep) {
      router.back();
    }
  };

  return (
    <Box 
      position="fixed"
      top="0"
      left={leftMargin}
      right="0"
      zIndex="1000"
      bg={background}
      p={4}
      pr="20px"  // 右側に追加のパディングを設定
      boxShadow="md"
    >
      <Flex align="center" justify="space-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          return (
            <React.Fragment key={index}>
              <Flex 
                direction="column" 
                align="center"
                onClick={() => handleStepClick(index)}
                cursor={index < currentStep ? "pointer" : "default"}
              >
                <Circle
                  size="30px"
                  bg={isActive ? "blue.500" : "gray.300"}
                  color="white"
                  mb={2}
                >
                  {index + 1}
                </Circle>
                <Text fontSize="sm" fontWeight={isActive ? "bold" : "normal"}>
                  {step}
                </Text>
              </Flex>
              {index !== steps.length - 1 && (
                <Box
                  flex="1"
                  height="2px"
                  bg={isActive && currentStep > index ? "blue.500" : "gray.300"}
                  mx={2}
                />
              )}
            </React.Fragment>
          );
        })}
      </Flex>
    </Box>
  );
};

/*
  // 使用例:
  // import { StepsHeader } from "../../components/StepsHeader";
  //
  // const steps = ['ステップ1', 'ステップ2', 'ステップ3'];
  // const currentStep = 0;
  //
  // export default function Page() {
  //   return (
  //     <>
  //       <StepsHeader steps={steps} currentStep={currentStep} />
  //       <Box mt="80px">
  //         ...メインコンテンツ...
  //       </Box>
  //     </>
  //   );
  // }
*/