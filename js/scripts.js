const locationLookup = (storeCode) =>
  allStores.find((s) => s.value === storeCode).name;

const dateFormatter = (date) => {
  const [dd, m, d, y] = new Date(date).toDateString().split(" ");
  const today = new Date().getFullYear();

  if (y > today) {
    return `${m} ${d}, ${y}`;
  }

  return `${m} ${d}`;
};

const createPage = (availabilities, prodId) => {
  availabilities.forEach((e) => {
    // Filters out non-stores
    if (e.classUnitKey.classUnitType !== "STO") {
      return;
    }

    const mainElem = document.createElement("div");
    mainElem.className = "availability-info";

    const locationElem = document.createElement("span");
    locationElem.className = "location";
    locationElem.innerText = locationLookup(e.classUnitKey.classUnitCode);
    mainElem.appendChild(locationElem);

    const item = e.availableStocks.find((i) => i.type === "CASHCARRY");
    const qty = item.quantity;
    const availableStocksElem = document.createElement("span");
    availableStocksElem.className = "stock-count";
    availableStocksElem.innerText = qty;
    mainElem.appendChild(availableStocksElem);

    if (!!item.restocks) {
      const restockElem = document.createElement("span");
      restockElem.className = "restock";

      item.restocks.forEach((r) => {
        const restockDateRangeElem = document.createElement("span");
        restockDateRangeElem.innerText = `Restocks ${dateFormatter(
          r.earliestDate
        )} - ${dateFormatter(r.latestDate)}`;
        restockElem.appendChild(restockDateRangeElem);

        // const restockQtyElem = document.createElement("span");
        // restockQtyElem.innerText = `Qty: ${r.quantity}`;
        // restockElem.appendChild(restockQtyElem);

        // const restockTypeElem = document.createElement("span");
        // restockTypeElem.innerText = `Type: ${r.type}`;
        // restockElem.appendChild(restockTypeElem);
      });

      mainElem.appendChild(restockElem);
    }

    document.getElementById(`main-${prodId}`).appendChild(mainElem);
  });
};

const getAvailabilities = async (prodId) => {
  const url = "https://api.ingka.ikea.com/cia/availabilities/ru/my?itemNos=";
  const clientId = "b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631";
  const headers = { "x-client-id": clientId };
  const response = await fetch(`${url}${prodId}`, { headers });
  const { data } = await response.json();
  const availabilities = data;

  createPage(availabilities, prodId);
};

const main = () => {
  getAvailabilities("10373589");
  getAvailabilities("00540664");
  getAvailabilities("50511683");
};

window.onload = main;
