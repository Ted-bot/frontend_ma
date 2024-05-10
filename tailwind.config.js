/*eslint-env node*/
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'heroImage': "url('/img/transparent_image_engaging_fight.png')",
        'heroBackGround': "radial-gradient(circle, rgba(255,225,177,1) 0%, rgba(255,208,134,0.9458158263305322) 65%, rgba(255,153,88,1) 100%)",
        'heroSunRiseImage': "url('/img/sunrise.png')",
        'woodenDummyImage': "url('/img/wooden_training_dummy.svg')"
      },
      content: {
        'asianFontWingIcon': "url('/img/orgi_wing_written_01.png')",
        'asianFontChunIcon': "url('/img/orgi_chun_written_01.png')",
        'balanceIcon': "url('/img/symbol_opacity_75_balance.png')",
      },
      fontFamily: {
        'fondamento': ["Fondamento"],
      }     
    },
  },
  plugins: [],
}

