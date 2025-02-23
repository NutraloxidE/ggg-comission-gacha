'use client'

import { Box, Button, Heading, useColorMode, Flex, useMediaQuery, RadioGroup, Radio, Stack, Checkbox, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SideMenu from "../../../components/SideMenu";
import { StepsHeader } from "../../../components/StepsHeader";
import { CommissionAmount } from "../../../components/CommissionAmount";

export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 1;

  // 各項目の状態
  const [commissionAmount, setCommissionAmount] = useState(18000);
  const [compositionType, setCompositionType] = useState("BGM");
  const [addLyrics, setAddLyrics] = useState(false);
  const [addSing, setAddSing] = useState(false);
  const [chipCount, setChipCount] = useState(0);
  const [discountOption, setDiscountOption] = useState("none"); // "enterprise", "none", "doujin", "student"

  // 作曲タイプ、作詞オプション、チップ量、ディスカウントの変更に応じて依頼金額を再計算
  useEffect(() => {
    const base = 18000;
    let extra = 0;
    switch (compositionType) {
      case "BGM":
        extra = 0;
        break;
      case "インスト":
        extra = 12000;
        break;
      case "作曲のみ":
        extra = 2000;
        break;
      case "作編曲":
        extra = 32000;
        break;
      default:
        extra = 0;
    }
    const lyricsExtra = addLyrics ? 12000 : 0;
    const singExtra = addSing ? 9000 : 0;
    const cost = base + extra + lyricsExtra + chipCount + singExtra;

    let discountMultiplier = 1;
    switch(discountOption) {
      case "enterprise":
        discountMultiplier = 1.5;
        break;
      case "doujin":
        discountMultiplier = 0.67;
        break;
      case "student":
        discountMultiplier = 0.5;
        break;
      default:
        discountMultiplier = 1;
    }
    setCommissionAmount(Math.floor(cost * discountMultiplier));
  }, [compositionType, addLyrics, chipCount, addSing, discountOption]);

  return (
    <Flex>
      <SideMenu toggleColorMode={toggleColorMode}/>

      {/* ヘッダーが固定なので、スクロール可能なコンテンツ領域に上部パディングを追加 */}
      <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh" pt="100px">
        <StepsHeader steps={steps} currentStep={currentStep} />

        {/* コンテンツ全体をラップするコンテナ */}
        <Flex
          padding={4}
          alignItems="center"
          justifyContent="center"
          minH="calc(100vh - 100px)"
        >
          <Box textAlign="center">
            <Heading mb={6} borderBottom="2px" borderColor="blue.200" >
              作曲について、詳細をお聞かせ下さい
            </Heading>

            {/* 以下、各コンテンツ */}
            <CommissionAmount amount={commissionAmount} soundEnabled={true} />

            {/* 作曲タイプ選択 */}
            <Box mt={4}>
              <Heading 
                as="h3" 
                size="md" 
                mb={4} 
                borderBottom="2px" 
                borderColor="blue.200" 
                pb={1}
              >
                作曲タイプを選択
              </Heading>
              <RadioGroup onChange={setCompositionType} value={compositionType}>
                <Stack direction="column">
                  <Radio value="BGM">BGM(一分半のループ)</Radio>
                  <Radio value="インスト">フル尺インスト</Radio>
                  <Radio value="作曲のみ">作曲のみ (コードとメロのMidi)</Radio>
                  <Radio value="作編曲">作編曲</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            {/* 作詞オプションのチェックボックス */}
            <Box mt={4}>
              <Heading 
                as="h3" 
                size="md" 
                mb={4} 
                borderBottom="2px" 
                borderColor="blue.200" 
                pb={1}
              >
                オプションを選択
              </Heading>
              <Checkbox mr="4" isChecked={addLyrics} onChange={(e) => setAddLyrics(e.target.checked)}>
                作詞(歌入れが無い場合は仮歌つき)
              </Checkbox>
              <Checkbox mr="4" isChecked={addSing} onChange={(e) => setAddSing(e.target.checked)}>
                歌入れ
              </Checkbox>
            </Box>

            {/* ディスカウントオプション */}
            <Box mt={4}>
              <Heading 
                as="h3" 
                size="md" 
                mb={4} 
                borderBottom="2px" 
                borderColor="blue.200" 
                pb={1}
              >
                ディスカウントを選択
              </Heading>
              <RadioGroup onChange={setDiscountOption} value={discountOption}>
                <Stack direction="column">
                  <Radio value="enterprise">企業</Radio>
                  <Radio value="none">変更なし</Radio>
                  <Radio value="doujin">同人</Radio>
                  <Radio value="student">学割</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            {/* チップの増減ボタン */}
            <Box mt={6}>
              <Heading 
                as="h3" 
                size="md" 
                mb={4} 
                borderBottom="2px" 
                borderColor="blue.200" 
                pb={1}
              >
                チップを下さい、やる気が出ます
              </Heading>
              <Flex justify="center" gap={6}>
                <Box
                  as="button"
                  onClick={() => setChipCount(Math.max(chipCount - 500, 0))}
                  bg="red.400"
                  borderRadius="full"
                  px={6}
                  py={3}
                  shadow="md"
                  transition="all 0.2s"
                  _hover={{ bg: "red.500", transform: "scale(1.1)" }}
                >
                  <Text color="white" fontWeight="bold">-500 チップ</Text>
                </Box>
                <Box
                  as="button"
                  onClick={() => setChipCount(chipCount + 500)}
                  bg="green.400"
                  borderRadius="full"
                  px={6}
                  py={3}
                  shadow="md"
                  transition="all 0.2s"
                  _hover={{ bg: "green.500", transform: "scale(1.1)" }}
                >
                  <Text color="white" fontWeight="bold">+500 チップ</Text>
                </Box>
              </Flex>
            </Box>

            {/* 備考・詳細フォーム */}
            <Box mt={6}>
              <Heading 
                as="h3" 
                size="md" 
                mb={4} 
                borderBottom="2px" 
                borderColor="blue.200" 
                pb={1}
              >
                備考・詳細
              </Heading>
              <textarea style={{ width: "100%", height: "200px" }} />
            </Box>
    
            {/* 依頼金額 */}  
            <Box mt={6}>
              <Heading
                as="h3"
                size="md"
                mb={4}
                borderBottom="2px"
                borderColor="blue.200"
                pb={1}
              >
                依頼金額
              </Heading>
            </Box>
            <CommissionAmount amount={commissionAmount} soundEnabled={false} />

            {/* サブミットボタン仮置き */}
            <Box mt={6}>
              <Button colorScheme="blue" onClick={() => router.push("/make-comission/compose/payment")}>
                この内容で依頼する
              </Button>
            </Box>

          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}