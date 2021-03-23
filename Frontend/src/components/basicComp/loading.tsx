import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './basic.css';

function LoadingSymbol() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current as HTMLDivElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./loading-dots.json') 
    })
  }, [])

  return (
    <div className="Loader">
      <div className="container" ref={container}>
      </div>
    </div>
  );
}

export default LoadingSymbol;
