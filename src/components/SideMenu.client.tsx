import dynamic from 'next/dynamic';

// サーバサイドレンダリング (SSR) を無効化することで、
// SideMenu コンポーネント内のウィンドウサイズに依存する処理が実行されず、
// hydrations の不整合によるエラーの原因を除去しています。
const SideMenu = dynamic(() => import('./SideMenu'), { ssr: false });

export default SideMenu;