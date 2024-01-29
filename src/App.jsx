import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";
import "./app.css";
import axios from "axios";

const BASE_URL =
  "https://api.fastforex.io/fetch-all?api_key=1b348172d6-a8c6d80dfc-s80gjn";

const App = () => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("AED");
  const [exchangeRates, setExchangeRates] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  // console.log(fromCurrency);
  // console.log(toCurrency);

  let toAmount, fromAmount;
  if (amountInFromCurrency && !isNaN(amount) && !isNaN(exchangeRates)) {
    fromAmount = amount;
    toAmount = amount * exchangeRates;
    console.log("exchange rates", exchangeRates);
  } else if (!isNaN(amount) && !isNaN(exchangeRates) && exchangeRates !== 0) {
    toAmount = amount;
    fromAmount = amount / exchangeRates;
  } else {
    // Handle the case when values are not valid numbers
    toAmount = 0;
    fromAmount = 0;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.results)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.results)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRates(data.results[firstCurrency]);
        // console.log(data);
      });
  }, []);

  const fetchData = () =>
    axios
      .get(
        `https://api.fastforex.io/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}&api_key=1b348172d6-a8c6d80dfc-s80gjn`
      )
      .then((data) => {
        console.log(data.data.result.rate);
        setExchangeRates(data.data.result.rate);
      })
      .catch((e) => {
        console.error("Error fetching data:", e);
      });

  // useEffect(() => {
  //   fetchData();
  // }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  return (
    <>
      <h1>Currency Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => {
          setFromCurrency(e.target.value);
          fetchData();
        }}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => {
          setToCurrency(e.target.value);
          fetchData();
        }}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
};

export default App;
