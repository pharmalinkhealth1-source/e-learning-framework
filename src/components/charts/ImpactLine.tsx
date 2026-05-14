"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 24px;
  position: relative;
`;

const SVGWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const Tooltip = styled.div<{ $visible: boolean; $x: number; $y: number }>`
  position: absolute;
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
  background: white;
  border: 1px solid #e5edf5;
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: ${props => props.$visible ? 'block' : 'none'};
  z-index: 10;
  transform: translate(-50%, -120%);
`;

const TooltipDate = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--hds-color-text-primary);
  margin-bottom: 4px;
`;

const TooltipValue = styled.div<{ $color: string }>`
  font-size: 0.8125rem;
  color: ${props => props.$color};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

interface DataPoint {
  date: string;
  pharmacists: number;
  patients: number;
}

export default function ImpactLine({ data }: { data: DataPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, date: '', pharmacists: 0, patients: 0 });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.pharmacists, d.patients)) || 0])
      .range([height, 0]);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b') as any))
      .selectAll('text')
      .attr('fill', '#425466')
      .style('font-size', '11px');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width))
      .selectAll('text')
      .attr('fill', '#425466')
      .style('font-size', '11px');

    svg.selectAll('.tick line').attr('stroke', '#f0f4f8').attr('stroke-dasharray', '4');
    svg.select('.domain').remove();

    // Area generator
    const area = d3.area<DataPoint>()
      .x(d => x(new Date(d.date)))
      .y0(height)
      .y1(d => y(d.patients))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#gradient-patients)')
      .attr('d', area);

    // Line generators
    const linePatients = d3.line<DataPoint>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.patients))
      .curve(d3.curveMonotoneX);

    const linePharmacists = d3.line<DataPoint>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.pharmacists))
      .curve(d3.curveMonotoneX);

    // Patients Line
    const pathPatients = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#09a5b6')
      .attr('stroke-width', 3)
      .attr('d', linePatients);

    const lengthPatients = pathPatients.node()?.getTotalLength() || 0;
    pathPatients.attr('stroke-dasharray', lengthPatients + ' ' + lengthPatients)
      .attr('stroke-dashoffset', lengthPatients)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Pharmacists Line
    const pathPharmacists = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6c30c0')
      .attr('stroke-width', 3)
      .attr('d', linePharmacists);

    const lengthPharmacists = pathPharmacists.node()?.getTotalLength() || 0;
    pathPharmacists.attr('stroke-dasharray', lengthPharmacists + ' ' + lengthPharmacists)
      .attr('stroke-dashoffset', lengthPharmacists)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Gradients
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient')
      .attr('id', 'gradient-patients')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#09a5b6').attr('stop-opacity', 0.2);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#09a5b6').attr('stop-opacity', 0);

    // Overlay for interaction
    const overlay = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const date = x.invert(mx);
        const bisect = d3.bisector((d: DataPoint) => new Date(d.date)).left;
        const index = bisect(data, date);
        const d = data[index] || data[data.length - 1];

        setTooltip({
          visible: true,
          x: x(new Date(d.date)) + margin.left,
          y: y(Math.max(d.patients, d.pharmacists)) + margin.top,
          date: d3.timeFormat('%B %Y')(new Date(d.date)),
          pharmacists: d.pharmacists,
          patients: d.patients
        });
      })
      .on('mouseleave', () => setTooltip(t => ({ ...t, visible: false })));

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data]);

  return (
    <Container ref={containerRef}>
      <SVGWrapper>
        <svg ref={svgRef}></svg>
      </SVGWrapper>
      <Tooltip $visible={tooltip.visible} $x={tooltip.x} $y={tooltip.y}>
        <TooltipDate>{tooltip.date}</TooltipDate>
        <TooltipValue $color="#09a5b6">Patients: {tooltip.patients.toLocaleString()}</TooltipValue>
        <TooltipValue $color="#6c30c0">Pharmacists: {tooltip.pharmacists.toLocaleString()}</TooltipValue>
      </Tooltip>
    </Container>
  );
}
