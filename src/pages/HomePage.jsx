import HomeBillboard from '../components/billboards/client/HomeBillboard.jsx'
import MainContentWrap from '../components/wraps/client/MainContentWrap.jsx';
import ActionCallButton from '../components/ui/button/ActionCallButton.jsx';
import HeroButtonWrap from '../components/wraps/client/HeroButtonWrap.jsx';
import FeatureCard from '../components/cards/FeatureCard.jsx';
import ParagraphWrap from '../components/wraps/client/ParagraphWrap.jsx';
import ParagraphCard from '../components/cards/ParagraphCard.jsx';
  
export default function HomePage() {
  
  const nameWrap = 'Focus Points'

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
    </>);
}
