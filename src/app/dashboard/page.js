import React from "react";
import Card from "../components/dashboard/card/card";
import Rightbar from "../components/dashboard/rightbar/rightbar";
import Transactions from "../components/dashboard/transactions/transactions";
import Chart from "../components/dashboard/chart/chart";

const Dashboard = () => {
  return (
    <div className="wrap flex gap-5 mt-5">
      <div className="main w-[70%] flex flex-col gap-5">
        <div className="cards flex gap-5 justify-between">
          <Card />
          <Card />
          <Card />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className="side w-[30%]">
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
