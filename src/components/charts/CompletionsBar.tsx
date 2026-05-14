"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;

const SVGWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

interface DataItem {
  quarter: string;
  completions: number;
}

export default function CompletionsBar({ data }: { data: DataItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 20, right: 60, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.quarter))
      .padding(0.3);

    const x = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(data, d => d.completions) || 0]);

    // Draw Y axis
    svg.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('fill', '#425466')
      .style('font-size', '12px')
      .style('font-weight', '600');

    svg.select('.domain').remove();

    // Draw bars
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.quarter) || 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#6c30c0')
      .attr('rx', 4);

    bars.transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .attr('width', d => x(d.completions));

    // Labels
    const labels = svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('y', d => (y(d.quarter) || 0) + y.bandwidth() / 2 + 5)
      .attr('x', 0)
      .attr('fill', '#0a2540')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .text(d => d.completions.toLocaleString());

    labels.transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .attr('x', d => x(d.completions) + 10);

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data]);

  return (
    <Container ref={containerRef}>
      <SVGWrapper>
        <svg ref={svgRef}></svg>
      </SVGWrapper>
    </Container>
  );
}
