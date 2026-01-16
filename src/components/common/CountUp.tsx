'use client'

import React, { useState, useEffect } from 'react'

interface CountUpProps {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
}

const CountUp: React.FC<CountUpProps> = ({
    end,
    duration = 2,
    prefix = '',
    suffix = '',
    decimals = 0
}) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            // Ease out quart
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

            const percentage = Math.min(progress / (duration * 1000), 1)
            const easedProgress = easeOutQuart(percentage)

            setCount(end * easedProgress)

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    const formattedValue = count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })

    return (
        <>{prefix}{formattedValue}{suffix}</>
    )
}

export default CountUp
