import React, { FC } from 'react';
import styles from './PieView.module.scss';

interface Segment {
    fill: string;
    fr: number;
    label: string;
}

interface PieViewProps {
    segments: Segment[];
    size?: number;
}

const RadialRectangle = (props: {angle?: number, fill: string}) => {
    const angle = props.angle ?? 0;
    const r = 50;
    const rsin = r * Math.sin(angle);
    const rcos = r * Math.cos(angle);

    const path = `
        M ${50 + rsin} ${50 + rcos}
        L ${50 - rsin} ${50 - rcos}
        L ${50 - rsin - rcos} ${50 - rcos + rsin}
        L ${50 + rsin - rcos} ${50 + rcos + rsin}`

    return <path d={path} fill={props.fill} clipRule="evenodd"/>
}

const RoundingEdge = (props: {angle?: number, fill: string}) => {
    const angle = props.angle ?? 0;
    const r = 43;
    const rsin = r * Math.sin(angle);
    const rcos = r * Math.cos(angle);

    return <circle cx={50 + rsin} cy={50 - rcos} r="7" fill={props.fill}/>
}

const SvgSegment = (props: {angle?: number, id: string, fill: string, size: number}) => {
    const angle = (props.angle ?? 0) - Math.PI / 6;
    const type = angle >= Math.PI ? "obtuse" : "acute";

    return <svg width={props.size} height={props.size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: "rotate(15deg)"}}>
        <defs>
            <mask id={`segment-mask-${props.id}`}>
                <RadialRectangle fill={"#FFFFFF"} angle={Math.PI}/>
                {type === "acute"
                    // diff angles either make the segment smaller (000000 subtracts) or larger
                    ? <RadialRectangle fill={"#000000"} angle={Math.PI - angle}/>
                    : <RadialRectangle fill={"#FFFFFF"} angle={(Math.PI - angle) - Math.PI}/>}
                <circle cx="50" cy="50" r="36" fill={"#000000"}/>
                <RoundingEdge fill={"#FFFFFF"}/>
                <RoundingEdge fill={"#FFFFFF"} angle={angle}/>
            </mask>
        </defs>

        <circle cx="50" cy="50" r="50" fill={props.fill} mask={`url(#segment-mask-${props.id})`}/>
    </svg>
}

const PieView: FC<PieViewProps> = ({segments, size}) => {
    const total = segments.reduce((acc, segment) => acc + segment.fr, 0);
    var circleProgress = 0;

    return <div className={styles.PieView} data-testid="PieView">
        <div className={styles.segments}>
            {segments.map((segment, i) => {
                const progress = circleProgress;
                circleProgress += segment.fr / total;

                return <div key={i} className={styles.segment} style={{rotate: `${progress * 360}deg`}}>
                    <SvgSegment id={i.toString()} fill={segment.fill} angle={(segment.fr / total) * 2 * Math.PI} size={size ?? 200}/>
                </div>
            })}
        </div>
        <span style={{width: `${size ?? 200}px`}}/>

        <div className={styles.labels} style={{height: `${size ?? 200}px`}}>
            {segments.map((segment, i) => <div key={i} className={styles.label}>
                <p className={styles.size} style={{backgroundColor: segment.fill}}>{segment.fr}</p>
                <p className={styles.description}>{segment.label}</p>
            </div>)}
        </div>
    </div>
}

export default PieView;
