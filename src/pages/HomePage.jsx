import HomeBillboard from '../components/billboards/client/HomeBillboard.jsx'
import MainContentWrap from '../components/wraps/client/MainContentWrap.jsx'
import ActionCallButton from '../components/ui/button/ActionCallButton.jsx'
import HeroButtonWrap from '../components/wraps/client/HeroButtonWrap.jsx'
import FeatureCard from '../components/cards/FeatureCard.jsx'
import ParagraphWrap from '../components/wraps/client/ParagraphWrap.jsx'
import ParagraphCard from '../components/cards/ParagraphCard.jsx'
import useStore from '../hooks/store/useStore.jsx'

  
export default function HomePage() {
  const [stateInStore, setStateInStore, isLoading] = useStore('loggedIn')
  const [userLoggedOut, setUserLoggedOut] = useStore('loggedOut')
  const nameWrap = 'Focus Points'
  
  console.log("user:LoggedIn ", !!stateInStore)
  console.log("user:LoggedOut ", !!userLoggedOut)

  return (
    <>
        <HomeBillboard />
        <HeroButtonWrap>
          <ActionCallButton />
        </HeroButtonWrap>
        <MainContentWrap name={nameWrap}>
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </MainContentWrap>
        <ParagraphWrap>
          <ParagraphCard />
        </ParagraphWrap>
    </>)
}
