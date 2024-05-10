export default function HomeBillBoard() {
      return (
        <>
          <section className="flex flex-wrap pb-3.5 h-4/5 bg-heroSunRiseImage bg-no-repeat bg-center bg-cover overflow-visible sm:pb-14 md:pt-4 md:pb-12">
              <section className="w-[32rem] pt-12 grow flex-col sm:w-1/2 sm:pb-6 md:pt-16 md:pb-8 lg:pb-12 lg:pt-20 xl:pb-8 xl:pt-16 2xl:pb-8 2xl:pt-20">
                <section className="w-5/6 py-5 pl-2 h-full text-balance flex items-center md:bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-r-full sm:h-72 max-w-full
                before:content-asianFontWingIcon before:opacity-35 before:relative before:w-0 before:bottom-24 before:end-[-16rem] before:sm:end-[-16rem] before:md:end-[-16rem] before:md:bottom-36 before:lg:end-[-22rem] before:xl:end-[-30rem] before:2xl:end-[-38rem]
                after:content-asianFontChunIcon after:opacity-35 after:relative after:left-[-4rem] after:w-0 after:top-28 after:sm:left-[-1rem] after:md:left-[-4rem] after:md:top-36 after:lg:left-[-3rem] after:xl:left-[3rem] after:2xl:left-[12rem]">
                  <section className="bg-gradient-to-r from-transparent to-orange-400 rounded-r-full md:bg-none">
                    <h1 className="font-fondamento text-5xl text-cyan-100 opacity-90 md:translate-x-12 sm:text-5xl md:text-cyan-700 md:opacity-90 xl:text-6xl 2xl:text-7x;">Engaging<br/>Wing Chun Lessons<br/>In Amsterdam</h1>

                  </section>
                </section>
              </section>
              <section className="flex container mt-0 mb-6 min-h-[16rem] w-[32rem] pr-20 pt-6 bg-heroImage bg-no-repeat bg-contain bg-center sm:w-1/2 sm:py-12 sm:min-h-0">
              </section>
          </section>
        </>);
}