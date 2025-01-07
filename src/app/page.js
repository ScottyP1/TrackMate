import Header from '../components/Header';
// import GoogleMap from '../components/GoogleMap';
// import InfoCard from '../components/InfoCard';

import TrackList from '@/components/Track/TrackList';

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
