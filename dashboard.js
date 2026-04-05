/****************************************************
 * DASHBOARD ENGINE — TWELVE DATA (Option 2)
 * Live Price + Previous Close + Percent Change
 ****************************************************/

// ⭐⭐⭐ INSERT YOUR API KEY HERE ⭐⭐⭐
const API_KEY = "528388fd472444618660d5286cd89e04";

// -----------------------------------------------
// CONFIG
// -----------------------------------------------
const TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "META",
  "TSLA", "NVDA", "JPM", "XOM", "V",
  "MA", "HD", "UNH", "PG", "KO",
  "PEP", "BAC", "WMT", "CVX", "DIS",
  "NFLX", "AMD", "INTC", "SPY", "QQQ"
];

const REFRESH_MS = 8000; // 8 seconds

// -----------------------------------------------
// CLOCK
// -----------------------------------------------
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);
updateClock();

// -----------------------------------------------
// FETCH PRICE DATA (Option 2)
// -----------------------------------------------
async function fetchQuote(symbol) {
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      console.error(`Error for ${symbol}:`, data.message);
      return null;
    }

    return {
      symbol: symbol,
      price: parseFloat(data.price),
      prevClose: parseFloat(data.previous_close),
      changePercent: parseFloat(data.percent_change)
    };

  } catch (err) {
    console.error(`Network error for ${symbol}:`, err);
    return null;
  }
}

// -----------------------------------------------
// UPDATE DASHBOARD
// -----------------------------------------------
async function updateDashboard() {
  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.textContent = "Updating…";

  const results = await Promise.all(TICKERS.map(fetchQuote));

  results.forEach((quote) => {
    if (!quote) return;

    const row = document.getElementById(`row-${quote.symbol}`);
    if (!row) return;

    const priceEl = row.querySelector(".price");
    const changeEl = row.querySelector(".change");

    if (priceEl) priceEl.textContent = quote.price.toFixed(2);
    if (changeEl) {
      const pct = quote.changePercent;
      changeEl.textContent = pct.toFixed(2) + "%";
      changeEl.style.color = pct >= 0 ? "limegreen" : "red";
    }
  });

  if (statusEl) statusEl.textContent = "Updated";
}

// Run immediately + auto-refresh
updateDashboard();
setInterval(updateDashboard, REFRESH_MS);

