"use client";
export const dynamic = "force dynamic";
import React from "react";
export const ContestRating = () => {
  const lineOptions = {
    chart: {
      id: "basic-line",
      toolbar: {
        show: false, // Hide zoom controls
      },
      zoom: {
        enabled: false, // Disable zooming
      },
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
      axisBorder: {
        show: false, // Hide y-axis border
      },
      axisTicks: {
        show: false, // Hide y-axis ticks
      },
    },
    grid: {
      show: false, // Hide grid background
    },
    colors: ["#F59E0B"], // Tailwind CSS amber color
    tooltip: {
      enabled: true, // Enable tooltips
    },
  };

  const lineSeries = [
    {
      name: "Contest",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 150, 180, 200], // Example data
    },
  ];

  const barOptions = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false, // Hide zoom controls
      },
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
      axisBorder: {
        show: false, // Hide y-axis border
      },
      axisTicks: {
        show: false, // Hide y-axis ticks
      },
    },
    grid: {
      show: false, // Hide grid background
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.3,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
          value: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true, // Enable tooltips
    },
    dataLabels: {
      enabled: false, // Hide data labels
    },
  };

  const barSeries = [
    {
      name: "Percentage",
      data: [
        10, 20, 15, 25, 10, 5, 12, 18, 13, 15, 14, 18, 20, 17, 16, 12, 14, 15,
        19, 21, 23, 20, 18,
      ], // Example data for 23 bars
    },
  ];

  return (
    <div className="w-full h-60 justify-between flex space-y-4 bg-white p-4"></div>
  );
};
