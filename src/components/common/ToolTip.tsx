import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { SliderProps } from 'rc-slider';
import { useEffect, useState } from 'react';
import 'tippy.js/themes/light.css';

export const SliderToolTip: SliderProps["handleRender"] = (node, handleProps) => {
    let [visible, setVisible] = useState(false)
    let { value, dragging } = handleProps
    useEffect(() => { setVisible(dragging) }, [dragging])
    return (
        <div
            onMouseLeave={(e) => {
                if (!dragging) {
                    setVisible(false)
                }
            }}
            onMouseEnter={() => setVisible(true)}
        >
            <Tippy content={`${value} ft`} theme="light" visible={visible}>
                {node}
            </Tippy>
        </div>
    );
};