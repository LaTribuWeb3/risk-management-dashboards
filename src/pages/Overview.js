import BigNumber from "bignumber.js";
import Box from "../components/Box";
import BoxGrid from "../components/BoxGrid";
import BoxRow from "../components/BoxRow";
import { Component } from "react";
import OverviewPieCharts from "../components/OverviewPieCharts";
import WhaleFriendly from "../components/WhaleFriendly";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

class Overview extends Component {
  render() {
    // median function
    function getMedian(arr) {
      const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0
        ? nums[mid]
        : (Number(nums[mid - 1]) + Number(nums[mid])) / 2;
    }
    let overviewData = {};
    let poolCollaterals = [];
    const tab = poolsStore["tab"];
    const poolsData = Object.assign([], poolsStore["pools_data"] || []);
    const tokenData = Object.assign([], poolsStore["tokens_data"] || []);
    const creditAccountData = Object.assign(
      [],
      poolsStore["creditAccounts_data"] || []
    );

    const selectedPool = poolsData.find((p) => p.address === tab);

    const creditAccountsForPool = creditAccountData.filter(
      (ca) => ca.poolAddress === tab
    );

    // compute value in $ for each credit account
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      let collateralValue = 0;
      for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
        const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
        const amountWDecimals =
          creditAccountsForPool[i].tokenBalances[j].amount;
        const token = tokenData.filter((tk) => tk.address === tokenAddress);
        const tokenDecimals = token[0]["decimals"];
        const tokenPrice = BigNumber(token[0]["priceUSD18Decimals"])
          .div(1e18)
          .toString();
        const amount = BigNumber(amountWDecimals)
          .div(BigNumber(10).pow(tokenDecimals))
          .toString();
        if (amountWDecimals !== "0") {
          collateralValue = BigNumber(collateralValue).plus(
            BigNumber(amount).multipliedBy(BigNumber(tokenPrice))
          );
        }
      }
      creditAccountsForPool[i]["collateralValue"] = collateralValue.toString();
    }
    /// compute median collateral value
    let medianCollateralArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      medianCollateralArray.push(creditAccountsForPool[i]["collateralValue"]);
    }
    const calculatedCollateralMedian = getMedian(medianCollateralArray);

    // compute total collateral value for pool
    let totalCollateral = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      totalCollateral = BigNumber(totalCollateral).plus(
        BigNumber(creditAccountsForPool[i]["collateralValue"])
      );
    }
    const calculatedTotalCollateral = totalCollateral;
    //////END

    // compute top 1 collateral
    let currentTopOneCollateral = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      if (
        BigNumber(currentTopOneCollateral).isLessThan(
          BigNumber(creditAccountsForPool[i]["collateralValue"])
        )
      ) {
        currentTopOneCollateral = creditAccountsForPool[i]["collateralValue"];
      }
    }

    const calculatedTop1Collateral = currentTopOneCollateral;
    //////END

    // compute top 10 collateral
    let collateralArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      collateralArray.push(creditAccountsForPool[i]["collateralValue"]);
    }
    collateralArray.sort((a, b) => b - a);
    collateralArray = collateralArray.slice(0, 10);
    let initialCollateralValue = 0;
    collateralArray = collateralArray.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      initialCollateralValue
    );
    const calculatedTop10Collateral = collateralArray.toString();

    // compute total debt
    let totalDebtArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      totalDebtArray.push(
        creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
      );
    }
    /// save array for median debt computation
    let medianDebtArray = totalDebtArray;

    // resume total debt computation
    let totalDebt = 0;
    totalDebt = totalDebtArray.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      totalDebt
    );
    const poolUnderlying = tokenData.filter(
      (tk) => tk.address === selectedPool["underlying"]
    );
    const underlyingPrice = BigNumber(
      poolUnderlying[0]["priceUSD18Decimals"]
    ).div(BigNumber(10).pow(18));

    totalDebt = BigNumber(totalDebt).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    totalDebt = BigNumber(totalDebt).multipliedBy(BigNumber(underlyingPrice));
    const calculatedTotalDebt = totalDebt.toString();

    // compute median debt
    medianDebtArray = medianDebtArray.map((value) =>
      Number(
        BigNumber(value).div(BigNumber(10).pow(poolUnderlying[0]["decimals"]))
      )
    );
    medianDebtArray = medianDebtArray.map((value) =>
      Number(BigNumber(value).multipliedBy(BigNumber(underlyingPrice)))
    );
    const calculatedDebtMedian = getMedian(medianDebtArray);

    // compute top 1 debt
    let currentTopOneDebt = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      if (
        BigNumber(currentTopOneDebt).isLessThan(
          BigNumber(
            creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
          )
        )
      ) {
        currentTopOneDebt =
          creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"];
      }
    }
    currentTopOneDebt = BigNumber(currentTopOneDebt).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    currentTopOneDebt = BigNumber(currentTopOneDebt).multipliedBy(
      BigNumber(underlyingPrice)
    );
    const calculatedTop1Debt = currentTopOneDebt.toString();
    //////END

    /// compute top 10 debt
    let debtArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      debtArray.push(
        creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
      );
    }
    debtArray.sort((a, b) => b - a);
    debtArray = debtArray.slice(0, 10);
    let debtValue = 0;
    for (let i = 0; i < debtArray.length; i++) {
      debtValue = BigNumber(debtValue).plus(BigNumber(debtArray[i]));
    }

    debtValue = BigNumber(debtValue).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    debtValue = Number(underlyingPrice) * Number(debtValue);
    const calculatedTop10Debt = debtValue.toString();

    // compute pool's tokens sums
    const indexedTokenSum = {};
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
        const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
        const amount = creditAccountsForPool[i].tokenBalances[j].amount;
        const indexedToken = tokenData.filter(
          (tk) => tk.address === tokenAddress
        )[0];

        let valToAddBN = BigNumber(amount);
        if (valToAddBN.gte(0)) {
          const symbol = indexedToken["symbol"];
          let lastValue = indexedTokenSum[symbol];
          // check if token is already inside object
          if (lastValue === undefined) {
            lastValue = 0;
          }
          const lastValBN = BigNumber(lastValue);
          const tokenDecimals = indexedToken["decimals"];
          const indexedTokenPrice = BigNumber(
            indexedToken["priceUSD18Decimals"]
          ).div(BigNumber(10).pow(18));
          valToAddBN = BigNumber(valToAddBN).div(
            BigNumber(10).pow(tokenDecimals)
          );
          valToAddBN = BigNumber(valToAddBN).multipliedBy(
            BigNumber(indexedTokenPrice)
          );
          let newTokenAmount = lastValBN.plus(valToAddBN);
          newTokenAmount = newTokenAmount.toNumber();
          indexedTokenSum[symbol] = newTokenAmount;
        }
      }

      const dataOverview = {
        collateral: {
          totalCollateral: calculatedTotalCollateral,
          top1Collateral: calculatedTop1Collateral,
          top10Collateral: calculatedTop10Collateral,
          medianCollateral: calculatedCollateralMedian,
        },
        debt: {
          totalDebt: calculatedTotalDebt,
          top1Debt: calculatedTop1Debt,
          top10Debt: calculatedTop10Debt,
          medianDebt: calculatedDebtMedian,
        },
        collateralGraphData: indexedTokenSum,
      };
      overviewData = dataOverview;
    }
    /// give PoolsStore the collateral symbols
    for (const data in overviewData["collateralGraphData"]) {
      poolCollaterals.push(data);
    }
    poolsStore["poolCollaterals"] = poolCollaterals;

    /// give PoolsStore the collateral values
    poolsStore["collateralValues"] = indexedTokenSum;

    const jsonTime = Math.floor(
      selectedPool["UpdateData"]["lastUpdate"] / 1000
    );
    poolsStore["updated"] = jsonTime;

    const loading = mainStore["overview_loading"];

    /// remove < 1$ tokens
    for (const data in overviewData["collateralGraphData"]) {
      if (Number(overviewData["collateralGraphData"][data]) < 1) {
        delete overviewData["collateralGraphData"][data];
      }
    }
    return (
      <div>
        <OverviewPieCharts data={overviewData} time={jsonTime} />
        <BoxGrid>
          <Box loading={loading} time={jsonTime}>
            <div>
              <BoxRow key="total_collateral">
                <div>Total Positional Value</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.totalCollateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="median_collateral">
                <div>Median Positional Value per User</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.medianCollateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="top1collateral">
                <div>Positional Value of Top 1 User</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.top1Collateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="top10collateral">
                <div>Positional Value of Top 10 Users</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.top10Collateral}
                  />
                </div>
              </BoxRow>
            </div>
          </Box>
          <Box loading={loading} time={jsonTime}>
            <div>
              <BoxRow key="total_debt">
                <div>Total Debt</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.totalDebt} />
                </div>
              </BoxRow>
              <BoxRow key="median_debt">
                <div>Median Debt per User</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.medianDebt} />
                </div>
              </BoxRow>
              <BoxRow key="top1debt">
                <div>Debt of Top 1 User</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.top1Debt} />
                </div>
              </BoxRow>
              <BoxRow key="top10debt">
                <div>Debt of Top 10 Users</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.top10Debt} />
                </div>
              </BoxRow>
            </div>
          </Box>
        </BoxGrid>
      </div>
    );
  }
}

export default observer(Overview);
