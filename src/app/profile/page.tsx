'use client'

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
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

// サイドメニューコンポーネントをメモ化
const MemoizedSideMenu = memo(SideMenu);

// プロフィールフォームコンポーネントを分離
const ProfileForm = memo(({ 
  profile, 
  profileImage, 
  handleInputChange, 
  handleImageUpload, 
  handleSubmit, 
  isLoading 
}) => {
  // フォーカス状態を追跡するための参照
  const formRef = useRef(null);

  // フォーカスイベントハンドラー
  const handleFocus = useCallback((e) => {
    // フォーカスイベントをここで処理し、バブリングを止める
    e.stopPropagation();
  }, []);

  return (
    <form onSubmit={handleSubmit} ref={formRef} onFocus={handleFocus}>
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
  );
});

ProfileForm.displayName = "ProfileForm";

// ローディングコンポーネント
const LoadingSpinner = memo(({ sideMenuWidth, toggleColorMode }) => (
  <Flex>
    <MemoizedSideMenu toggleColorMode={toggleColorMode} />
    <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh">
      <Center h="100vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    </Box>
  </Flex>
));

LoadingSpinner.displayName = "LoadingSpinner";

export default function Home() {
  const { data: session, status } = useSession();
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)", {
    ssr: true,
    fallback: false
  });
  const toast = useToast();
  
  // ref を使用して安定した参照を保持
  const profileRef = useRef({
    name: "",
    bio: "",
    email: "",
    website: "",
    twitter: "",
    instagram: "",
    balance: 0
  });

  // プロファイル情報の状態
  const [profile, setProfile] = useState(profileRef.current);
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  // 前回のレンダリング時のセッションを追跡
  const prevSessionRef = useRef(null);

  // サイドメニューの幅をメモ化
  const sideMenuWidth = useMemo(() => 
    isLargerThanThatSize ? "200px" : "75px",
  [isLargerThanThatSize]);

  // プロフィール取得関数をメモ化
  const fetchProfile = useCallback(async () => {
    // セッションがない、もしくは前回と同じセッションなら何もしない
    if (!session?.user || (prevSessionRef.current === session)) return;
    
    // 現在のセッションを記録
    prevSessionRef.current = session;
    
    try {
      setIsFetching(true);
      const response = await fetch('/api/profile', {
        // キャッシュを無効化
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'プロフィールの取得に失敗しました');
      }
      
      const profileData = await response.json();
      
      // refを先に更新
      profileRef.current = {
        name: profileData.name || profileRef.current.name,
        email: profileData.email || profileRef.current.email,
        bio: profileData.bio || profileRef.current.bio,
        website: profileData.website || profileRef.current.website,
        twitter: profileData.twitter || profileRef.current.twitter,
        instagram: profileData.instagram || profileRef.current.instagram,
        balance: profileData.balance || profileRef.current.balance
      };
      
      // 状態更新
      setProfile(profileRef.current);
      
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
  }, [session, toast]);

  // セッションが利用可能になったらデータ取得
  useEffect(() => {
    if (status === 'authenticated' && !hasFetchedProfile) {
      fetchProfile();
      setHasFetchedProfile(true);
    } else if (status === 'unauthenticated') {
      setIsFetching(false);
    }
  }, [status, fetchProfile, hasFetchedProfile]);

  // window focus/blur イベント対策
  useEffect(() => {
    const handleVisibilityChange = () => {
      // タブがフォーカスされたときの不必要な更新を防止
      if (document.visibilityState === 'visible') {
        // 意図的に何もしない
      }
    };

    // フォーカスイベントで不要な更新が発生しないようにする
    const handleWindowFocus = (e) => {
      e.stopPropagation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus, true);
    };
  }, []);

  // 画像アップロードのハンドラーをメモ化
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // フォーム入力ハンドラーをメモ化
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // ref も更新
    profileRef.current = {
      ...profileRef.current,
      [name]: value
    };
    
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // フォーム送信ハンドラーをメモ化
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileRef.current,
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
  }, [profileImage, toast]);

  if (isFetching) {
    return <LoadingSpinner sideMenuWidth={sideMenuWidth} toggleColorMode={toggleColorMode} />;
  }

  return (
    <Flex>
      <MemoizedSideMenu toggleColorMode={toggleColorMode} />
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

            <ProfileForm 
              profile={profile}
              profileImage={profileImage}
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}