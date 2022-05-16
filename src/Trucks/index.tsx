import React, { useEffect, useMemo, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as q from "../graphql/queries";
import * as m from "../graphql/mutations";

import "./Trucks.scss";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Column, useTable } from "react-table";

const ROOT_CLASS = "tms-front-trucks";
const TABLE_CLASS = `${ROOT_CLASS}-table`;
const HEADER_CLASS = `${TABLE_CLASS}-header`;
const CELL_CLASS = `${TABLE_CLASS}-cell`;

const fetchTrucks = async () => {
  return await API.graphql(graphqlOperation(q.listTrucks), {});
};

type tList = { id: number; model: string; year: number; mileage: number }[];

export const Trucks = () => {
  const [truckList, setTruckList] = useState([] as tList);
  const memoList = useMemo(() => truckList, [truckList]);

  useEffect(() => {
    (async () => {
      const result = await fetchTrucks();
      setTruckList((result as any).data.listTrucks.items);
    })();
  }, []);

  const columns: Array<Column> = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Model", accessor: "model" },
      { Header: "Year", accessor: "year" },
      { Header: "Mileage", accessor: "mileage" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: memoList });

  return (
    <div className={ROOT_CLASS}>
      <p>This table lists the existing transportation vehicles.</p>

      <table {...getTableProps()} className={TABLE_CLASS}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={HEADER_CLASS}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className={CELL_CLASS}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
