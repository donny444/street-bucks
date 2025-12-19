"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import axios, { AxiosResponse } from "axios";

import { Container, Row, Col, Button } from "react-bootstrap";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

import { barChartData, barChartOptions } from "../data/bar_chart.ts";
import { pieChartData, pieChartOptions } from "../data/pie_chart.ts";
import { lineChartData, lineChartOptions } from "../data/line_chart.ts";

import PeriodEnum from "../interfaces/period_enum.ts";

export default function InsightsPage() {
  return (
    <Container className="m-3 gap-2">
      <Row className="d-flex justify-content-between align-items-center">
        <Col>
          <TopMenusChart />
        </Col>
      </Row>
      <Row className="d-flex justify-content-between align-items-center">
        <Col>
          <SalesByPeriodChart />
        </Col>
      </Row>
    </Container>
  )
}

function TopMenusChart() {
  const [data, setData] = useState(null);

  return (
    <Container>
      <Pie data={pieChartData} options={pieChartOptions} />
    </Container>
  )
}

function SalesByPeriodChart() {
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.WEEKLY);
  
  return (
    <Container>
      <Container className="btn-group mb-3" role="group" aria-label="Time period">
        <Button
          variant={period === PeriodEnum.WEEKLY ? "primary" : "outline-primary"}
          onClick={() => setPeriod(PeriodEnum.WEEKLY)}
        >
          {PeriodEnum.WEEKLY}
        </Button>
        <Button
          variant={period === PeriodEnum.MONTHLY ? "primary" : "outline-primary"}
          onClick={() => setPeriod(PeriodEnum.MONTHLY)}
        >
          {PeriodEnum.MONTHLY}
        </Button>
        <Button
          variant={period === PeriodEnum.ANNUAL ? "primary" : "outline-primary"}
          onClick={() => setPeriod(PeriodEnum.ANNUAL)}
        >
          {PeriodEnum.ANNUAL}
        </Button>
      </Container>
      { period === PeriodEnum.WEEKLY || period === PeriodEnum.MONTHLY ? (
        <LineChartSales lineChartData={lineChartData} lineChartOptions={lineChartOptions} period={period} />
      ) : <></> }
      { period === PeriodEnum.ANNUAL ? (
        <Bar data={barChartData} options={barChartOptions} />
      ): <></> }
    </Container>
  )
}

