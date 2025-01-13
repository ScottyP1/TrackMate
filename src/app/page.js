import Header from '../components/Header';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation'


export default function Home() {

  return (
    <div className="relative w-full text-center bg-black">
      <div className="absolute top-0 homeBG bg-cover bg-center"></div>
      <div className="relative px-4">
        <Header />
      </div>
    </div >
  );
}
