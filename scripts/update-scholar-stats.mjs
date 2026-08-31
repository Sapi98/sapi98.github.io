import fs from "node:fs/promises";

const API_KEY = process.env.SERPAPI_KEY;
const AUTHOR_ID = "PUi9jlQAAAAJ";

if (!API_KEY) {
  throw new Error(
    "The SERPAPI_KEY environment variable is missing."
  );
}

const parameters = new URLSearchParams({
  engine: "google_scholar_author",
  author_id: AUTHOR_ID,
  hl: "en",
  api_key: API_KEY
});

const endpoint =
  `https://serpapi.com/search.json?${parameters}`;

const response = await fetch(endpoint);

if (!response.ok) {
  throw new Error(
    `SerpApi request failed with status ${response.status}.`
  );
}

const data = await response.json();

if (data.error) {
  throw new Error(`SerpApi returned an error: ${data.error}`);
}

const citationTable = data?.cited_by?.table;

if (!Array.isArray(citationTable)) {
  throw new Error(
    "Google Scholar citation statistics were not found."
  );
}

const citationRow = citationTable.find(
  row => row?.citations?.all !== undefined
);

const hIndexRow = citationTable.find(
  row => row?.h_index?.all !== undefined
);

const citations = Number(
  citationRow?.citations?.all
);

const hIndex = Number(
  hIndexRow?.h_index?.all
);

if (
  !Number.isFinite(citations) ||
  !Number.isFinite(hIndex)
) {
  throw new Error(
    "Citation or h-index data was invalid."
  );
}

const statistics = {
  citations,
  hIndex,
  updatedAt: new Date().toISOString(),
  source: "Google Scholar via SerpApi"
};

await fs.writeFile(
  "scholar-stats.json",
  `${JSON.stringify(statistics, null, 2)}\n`,
  "utf8"
);

console.log(
  `Updated Scholar statistics: ${citations} citations, h-index ${hIndex}.`
);