"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
`;

const SVGContainer = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  position: relative;
`;

const TotalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

const TotalValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #0a2540;
  line-height: 1;
`;

const TotalLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #425466;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  margin-top: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: #425466;
  font-weight: 500;
`;

const ColorBox = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${props => props.$color};
`;

interface DataItem {
  label: string;
  value: number;
  color: string;
}

export default function VaccinationDonut({ data }: { data: DataItem[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [total, setTotal] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.7;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<DataItem>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(8)
      .padAngle(0.04);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', d => d.data.color)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t)) || '';
        };
      });

    // Total calculation and animation
    const sum = d3.sum(data, d => d.value);
    setTotal(sum);

    const timer = d3.timer((elapsed) => {
      const progress = Math.min(elapsed / 1000, 1);
      setDisplayTotal(Math.floor(sum * progress));
      if (progress === 1) timer.stop();
    });

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
      timer.stop();
    };
  }, [data]);

  return (
    <Container>
      <SVGContainer>
        <svg ref={svgRef}></svg>
        <TotalContainer>
          <TotalValue>{displayTotal.toLocaleString()}</TotalValue>
          <TotalLabel>Doses</TotalLabel>
        </TotalContainer>
      </SVGContainer>
      <Legend>
        {data.map((item, i) => (
          <LegendItem key={i}>
            <ColorBox $color={item.color} />
            {item.label}
          </LegendItem>
        ))}
      </Legend>
    </Container>
  );
}
