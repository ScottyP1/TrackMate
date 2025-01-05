export default function Label({ title }) {
    return (
        <div className="rounded-full border border-2 border-blue-500 hover:bg-blue-500">
            <h1 className="text-white text-md md:text-lg">{title}</h1>
        </div>
    )
}