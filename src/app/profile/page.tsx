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
  useToast,
  Spinner,
  Center
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
    instagram: "",
    balance: 0 // 所有金額を追加
  });

  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // セッションが利用可能になったらデータベースからプロフィールを取得
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) return;
      
      try {
        setIsFetching(true);
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'プロフィールの取得に失敗しました');
        }
        
        const profileData = await response.json();
        
        // プロフィール情報を設定
        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          bio: profileData.bio || "",
          website: profileData.website || "",
          twitter: profileData.twitter || "",
          instagram: profileData.instagram || "",
          balance: profileData.balance || 0 // 所有金額を設定
        });
        
        // プロフィール画像があれば設定
        if (profileData.image) {
          setProfileImage(profileData.image);
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        toast({
          title: "プロフィールの取得に失敗しました",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsFetching(false);
      }
    }
    
    fetchProfile();
  }, [session, toast]);

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
      // APIを呼び出してプロフィール情報を更新
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          image: profileImage
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'プロフィールの更新に失敗しました');
      }

      toast({
        title: "プロフィールを更新しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
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

  if (isFetching) {
    return (
      <Flex>
        <SideMenu toggleColorMode={toggleColorMode} />
        <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh">
          <Center h="100vh">
            <Spinner size="xl" thickness="4px" color="blue.500" />
          </Center>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex>
      <SideMenu toggleColorMode={toggleColorMode} />
      <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh" pt="50px">
        {/* 残りのUIコード（変更なし） */}
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
              {/* 元のフォームコード（変更なし） */}
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

                {/* 残りのフォーム要素は同じ */}
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