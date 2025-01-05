export default function Bubble({ num }) {
    return (
        <div className="rounded-full w-[50px] h-[50px] md:w-[100px] md:h-[100px] mx-auto place-content-center bg-blue-500">
            <h2 className="text-white text-5xl cheesy mt-2">{num}</h2>
        </div>
    )
}