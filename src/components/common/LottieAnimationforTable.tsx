import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import animationData from '../../loader.json';

const LottieAnimationforTable: React.FC = () => {
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let animation: AnimationItem | undefined = undefined;

        if (container.current) {
            animation = lottie.loadAnimation({
                container: container.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData,
            });
        }

        return () => {
            if (animation) {
                animation.destroy();
            }
        };
    }, []);

    return (
        <>
        
            <div className='lottie-outerlay'> 
                <div className="lottie-container" ref={container}></div>
            </div>
        </>
    );
};

export default LottieAnimationforTable;
