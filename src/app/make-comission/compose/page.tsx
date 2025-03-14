'use client'

import { Box, Button, Heading, useColorMode, Flex, useMediaQuery, RadioGroup, Radio, Stack, Checkbox, Text, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SideMenu from '@/components/SideMenu.client';
import { StepsHeader } from "../../../components/StepsHeader";
import { CommissionAmount } from "../../../components/CommissionAmount";
import { SingleOrder } from "@/app/types/order/SingleOrder";
import { GroupedOrder } from "@/app/types/order/GroupedOrder";
import OrderReceiptSimple from "../../../components/OrderReceiptSimple";

export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 1;

  // 各項目の状態
  const [commissionAmount, setCommissionAmount] = useState<number>(19000);
  const [compositionType, setCompositionType] = useState<string>("BGM");
  const [addLyrics, setAddLyrics] = useState<boolean>(false);
  const [addSing, setAddSing] = useState<boolean>(false);
  const [chipCount, setChipCount] = useState<number>(0);
  const [discountOption, setDiscountOption] = useState<string>("none"); // "enterprise", "none", "doujin", "student"
  const [remarks, setRemarks] = useState<string>(""); // 備考・詳細の状態
  const [groupedOrder, setGroupedOrder] = useState<GroupedOrder | null>(null);

  // 作曲タイプが変更されたら、作詞オプションと歌唱オプションを無効化
  useEffect(() => {
    if (compositionType !== "作曲のみ" && compositionType !== "作編曲") {
      setAddLyrics(false);
      setAddSing(false);
    }
  }, [compositionType]);

  // 作曲タイプ、作詞オプション、チップ量、ディスカウントの変更に応じて依頼金額を再計算
  useEffect(() => {
    const orders: SingleOrder[] = [];

    const composerOrder = new SingleOrder("作曲", "not defined yet", 18980, new Date());
    let addArranger = false;

    switch (compositionType) {
      case "BGM":
        composerOrder.totalFeeThatClientPays = 19000;
        composerOrder.orderDetails = "BGM(一分半のループ)";
        break;
      case "ビート":
        composerOrder.totalFeeThatClientPays = 19000;
        composerOrder.orderDetails = "ラップ用ビート、一分半程度でループするように。";
        break;
      case "フル尺インスト":
        composerOrder.totalFeeThatClientPays = 31000;
        composerOrder.orderDetails = "フル尺インスト";
        break;
      case "作曲のみ":
        composerOrder.totalFeeThatClientPays = 21000;
        composerOrder.orderDetails = "作曲のみ (コードとメロのMidi)";
        break;
      case "作編曲":
        composerOrder.totalFeeThatClientPays = 21000;
        composerOrder.orderDetails = "作編曲";
        addArranger = true;
        break;
      default:
        composerOrder.totalFeeThatClientPays = 0;
    }

    const composerOrderPos = orders.push(composerOrder);
    const composerOrderIndex = composerOrderPos - 1;

    if (addArranger) {
      orders[composerOrderIndex].workType = "作曲";
      orders[composerOrderIndex].orderDetails = "編曲者が別でいる場合作曲のみ (コードとメロのMidi)";
      const arrangerOrder = new SingleOrder("編曲", "作曲者と編曲者が別の場合編曲のみ", 27000, new Date());
      orders.push(arrangerOrder);
    }

    if (addLyrics) {
      const lyricistOrder = new SingleOrder("作詞", "作詞、仮歌", 12000, new Date());
      orders.push(lyricistOrder);
    }

    if (addSing) {
      const singerOrder = new SingleOrder("歌唱", "本番歌唱", 9000, new Date());
      orders.push(singerOrder);
    }

    // ディスカウントオプションに応じて金額を変更
    let discountMultiplier = 1;
    switch(discountOption) {
      case "enterprise":
        discountMultiplier = 1.8;
        break;
      case "imrich":
        discountMultiplier = 1.35;
        break;
      case "doujin":
        discountMultiplier = 0.90;
        break;
      case "student":
        discountMultiplier = 0.70;
        break;
      default:
        discountMultiplier = 1;
    }

    // ディスカウントの適用
    orders.forEach((order) => {
      order.totalFeeThatClientPays *= discountMultiplier;
    });

    // チップを人数で割り、手数料に加算
    const tipPerPerson = chipCount * discountMultiplier / orders.length;
    orders.forEach((order) => {
      order.totalFeeThatClientPays += tipPerPerson;
    });

    // GroupedOrderを作成
    const whatIsThisJobType = orders[0].workType;
    const newGroupedOrder = new GroupedOrder(orders, whatIsThisJobType, "not assigned yet", new Date());
    setGroupedOrder(newGroupedOrder);
    setCommissionAmount(newGroupedOrder.totalFeeThatClientPays);
  }, [compositionType, addLyrics, chipCount, addSing, discountOption]);



  const handleSubmit = () => {
    if (groupedOrder) {

      groupedOrder.orderDetails = remarks;
      const randomNum = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      groupedOrder.randomNum = randomNum; // randomNumをgroupedOrderに追加

      const groupedOrderString = JSON.stringify(groupedOrder);
      router.push(`/make-comission/confirm-and-payment?groupedOrder=${encodeURIComponent(groupedOrderString)}&randomNum=${randomNum}`);
    }
  };

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

            {/*
            {groupedOrder ? (
              <OrderReceiptSimple groupedOrder={groupedOrder} />
            ) : (
              <Heading>Loading...</Heading>
            )}
            */}

            <Heading mb={6} borderBottom="2px" borderColor="blue.200" >
              作曲について、詳細をお聞かせ下さい。
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
                  <Radio value="ビート">ラップ用ビート</Radio>
                  <Radio value="フル尺インスト">フル尺インスト</Radio>
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
              <Checkbox 
                mr="4" 
                isChecked={addLyrics} 
                onChange={(e) => setAddLyrics(e.target.checked)}
                disabled={compositionType !== "作曲のみ" && compositionType !== "作編曲"}
              >
                作詞(歌入れが無い場合は仮歌つき)
              </Checkbox>
              <Checkbox 
                mr="4" 
                isChecked={addSing} 
                onChange={(e) => setAddSing(e.target.checked)}
                disabled={compositionType !== "作曲のみ" && compositionType !== "作編曲"}
              >
                歌唱(本番歌唱, Edit, Mixつき)
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
                ディスカウント・追加インセンティブを選択
              </Heading>
              <RadioGroup onChange={setDiscountOption} value={discountOption}>
                <Stack direction="column">
                  <Radio value="enterprise">企業</Radio>
                  <Radio value="imrich">私はお金を持っています(めっちゃやる気出る)</Radio>
                  <Radio value="none">変更なし</Radio>
                  <Radio value="doujin">同人(私はお金がありません)</Radio>
                  <Radio value="student">学割 (21歳まで、在学中に限る)</Radio>
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
                チップを下さい、やる気が出ます。
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
                <Box
                  as="button"
                  onClick={() => setChipCount(chipCount + 1000)}
                  bg="green.400"
                  borderRadius="full"
                  px={6}
                  py={3}
                  shadow="md"
                  transition="all 0.2s"
                  _hover={{ bg: "green.500", transform: "scale(1.1)" }}
                >
                  <Text color="white" fontWeight="bold">+1000 チップ</Text>
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
              <Textarea 
                style={{ width: "100%", height: "200px" }} 
                placeholder="ジャンル、リファレンス、希望の展開等を入力してください、もし何も入力されない場合、クリエイターが自由に作ります。" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
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
              <Button colorScheme="blue" onClick={handleSubmit}>
                依頼の最終確認
              </Button>
            </Box>

          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}