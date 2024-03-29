import numeral from "numeral";
import React from "react";

import "./Table.css";

function Table(props) {
  const { countries } = props;
  return (
    <div className="table">
      {countries?.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0, 0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}
export default Table;
