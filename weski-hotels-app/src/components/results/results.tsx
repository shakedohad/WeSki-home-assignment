import React from "react";
import "./results.scss";
import dayjs from "dayjs";
import { Hotel, SearchParams } from "../../types";
import { getResortName } from "../../constants/resorts";
import HotelCard from "./hotel-card/hotel-card";

interface Props {
  results: Hotel[];
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams;
}

function formatDateRange(fromDate: string, toDate: string): string {
  // Input format: MM/DD/YYYY
  const from = dayjs(fromDate, "MM/DD/YYYY");
  const to = dayjs(toDate, "MM/DD/YYYY");
  const sameMonth = from.month() === to.month() && from.year() === to.year();

  const fromStr = from.format("MMM D");
  const toStr = sameMonth ? to.format("D") : to.format("MMM D");
  return `${fromStr} - ${toStr}`;
}

const Results: React.FC<Props> = ({ results, isLoading, error, searchParams }) => {
  const resortName = getResortName(searchParams.ski_site);
  const dateRange = formatDateRange(searchParams.from_date, searchParams.to_date);
  const peopleLabel = searchParams.group_size === 1 ? "1 person" : `${searchParams.group_size} people`;
  const sortedResults = [...results].sort((a, b) => a.pricePerPerson - b.pricePerPerson);

  return (
    <section className="results-section">
      <h1 className="results-title">Select your ski trip</h1>

      <p className="results-summary">
        {`${sortedResults.length} ski trip${sortedResults.length !== 1 ? "s" : ""} options • ${resortName} • ${dateRange} • ${peopleLabel}`}
        {isLoading && <span className="results-loading-indicator" />}
      </p>

      {error && (
        <div className="results-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!error && sortedResults.length === 0 && !isLoading && (
        <p className="results-empty">No results found.</p>
      )}

      {sortedResults.length > 0 && (
        <ul className="hotel-list">
          {sortedResults.map((hotel) => (
            <li key={`${hotel.supplier}-${hotel.externalHotelId}-${hotel.roomCapacity}-${hotel.pricePerPerson}`}>
              <HotelCard hotel={hotel} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Results;
