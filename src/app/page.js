'use client'
import Header from '../components/Header';
import useFetchUserAccount from '@/hooks/useFetchUserAccount';



export default function Home() {
  // useFetchUserAccount();
  return (
    <div className="relative w-full text-center bg-black">
      <div className="absolute top-0 homeBG bg-cover bg-center"></div>
      <div className="relative px-4">
        <Header />
      </div>
    </div >
  );
}
