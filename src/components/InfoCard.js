import Bubble from './Bubble';
import Label from './Label';

export default function InfoCard({ title, classes }) {
    return (
        <div className={`bg-black text-black p-6 col-span-4 md:col-span-1 ${classes}`}>
            <h1 className='text-2xl md:text-4xl font-bold text-white underline underline-offset-4'>{title}</h1>
            <div className="flex justify-center mt-6 rounded-lg grid grid-cols-3 gap-4">
                <Label title='National' />
                <Label title='Outdoor' />
                <Label title='Indoor' />
            </div>
            <div className="flex justify-center mt-6 rounded-lg grid grid-cols-3 gap-4">
                <Bubble num='5' />
                <Bubble num='12' />
                <Bubble num='456' />
                <Bubble num='333' />
                <Bubble num='5' />
                <Bubble num='35' />
            </div>
        </div>
    )
}


//results => name: name, address: formatted_address, maps: geometry=> location(lat, long), rating: rating