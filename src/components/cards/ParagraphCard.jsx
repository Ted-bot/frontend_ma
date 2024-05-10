export default function ParagraphCard() {

    return (
        <>
            <div className="max-w-lg min-w-full rounded overflow-hidden shadow-lg lg:shadow-none md:max-w-xl lg:max-w-2xl bg-neutral-100">
                <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
                    <p className="text-gray-700 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    </p>
                </div>
            </div>
        </>
    )
}