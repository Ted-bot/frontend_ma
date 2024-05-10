import HomeBillboard from '../components/billboards/client/HomeBillboard.jsx'
import FeatureCardsWrap from '../components/wraps/client/FeatureCardsWrap.jsx';
import ActionCallButton from '../components/ui/button/ActionCallButton.jsx';
import HeroButtonWrap from '../components/wraps/client/HeroButtonWrap.jsx';
import FeatureCard from '../components/cards/FeatureCard.jsx';
import ParagraphWrap from '../components/wraps/client/ParagraphWrap.jsx';
import ParagraphCard from '../components/cards/ParagraphCard.jsx';
  
export default function HomePage() {
  
  return (
    <>
        <HomeBillboard />
        <HeroButtonWrap>
          <ActionCallButton />
        </HeroButtonWrap>
        <FeatureCardsWrap>
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </FeatureCardsWrap>
        <ParagraphWrap>
          <ParagraphCard />
        </ParagraphWrap>
    </>);
}
