'use client'

import { useState, useEffect } from "react";
import { 
  Box, 
  Heading, 
  useColorMode, 
  Button, 
  Flex, 
  useMediaQuery, 
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Avatar,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import SideMenu from '@/components/SideMenu.client';
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";
  const toast = useToast();

  // プロファイル情報の状態
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    email: "",
    website: "",
    twitter: "",
    instagram: ""
  });

  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // セッションが利用可能になったらプロフィールを初期化
  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || ""
      }));
      // プロフィール画像がある場合は設定
      if (session.user.image) {
        setProfileImage(session.user.image);
      }
    }
  }, [session]);

  // 画像アップロードのハンドラー
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ここでAPIを呼び出してプロフィール情報を更新
      // const response = await fetch('/api/profile/update', { ... });

      toast({
        title: "プロフィールを更新しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Flex>
      <SideMenu toggleColorMode={toggleColorMode} />
      <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh" pt="50px">
        <Flex 
          padding={6} 
          alignItems="center" 
          justifyContent="center"
          minH="calc(100vh - 50px)"
        >
          <Box 
            width="100%" 
            maxWidth="800px" 
            bg="white" 
            borderRadius="lg" 
            boxShadow="md" 
            p={8}
            _dark={{ bg: "gray.700" }}
          >
            <Heading mb={6} borderBottom="2px" borderColor="blue.200" pb={2}>
              プロフィール編集
            </Heading>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="start">
                {/* プロフィール画像 */}
                <FormControl>
                  <FormLabel>プロフィール画像</FormLabel>
                  <HStack>
                    <Avatar 
                      size="xl" 
                      src={profileImage} 
                      name={profile.name || "ユーザー"} 
                    />
                    <Box position="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                      <IconButton
                        as="label"
                        htmlFor="image-upload"
                        aria-label="Upload image"
                        icon={<FaCamera />}
                        colorScheme="blue"
                        variant="solid"
                        cursor="pointer"
                      />
                      <Text mt={2} fontSize="sm" color="gray.500">
                        画像をアップロード
                      </Text>
                    </Box>
                  </HStack>
                </FormControl>

                {/* ユーザー名 */}
                <FormControl isRequired>
                  <FormLabel>ユーザー名</FormLabel>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="ユーザー名"
                  />
                </FormControl>

                {/* メールアドレス */}
                <FormControl isRequired>
                  <FormLabel>メールアドレス</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                  />
                </FormControl>

                {/* 自己紹介 */}
                <FormControl>
                  <FormLabel>自己紹介</FormLabel>
                  <Textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    placeholder="あなたについて教えてください"
                    rows={4}
                  />
                </FormControl>

                {/* ウェブサイト */}
                <FormControl>
                  <FormLabel>ウェブサイト</FormLabel>
                  <Input
                    name="website"
                    value={profile.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                  />
                </FormControl>

                {/* SNSアカウント */}
                <FormControl>
                  <FormLabel>Twitter</FormLabel>
                  <Input
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Instagram</FormLabel>
                  <Input
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleInputChange}
                    placeholder="username"
                  />
                </FormControl>

                {/* 送信ボタン */}
                <HStack spacing={4} width="100%" pt={4} justifyContent="flex-end">
                  <Button variant="outline" colorScheme="gray">
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                  >
                    保存する
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}