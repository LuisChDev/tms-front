import React, { useEffect, useMemo, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as q from "../graphql/queries";
import * as m from "../graphql/mutations";

import "./Locations.scss";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Column, useTable } from "react-table";
import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";

const ROOT_CLASS = "tms-front-locations";
const TABLE_CLASS = `${ROOT_CLASS}-table`;
const HEADER_CLASS = `${TABLE_CLASS}-header`;
const CELL_CLASS = `${TABLE_CLASS}-cell`;
const FORM_CLASS = `${ROOT_CLASS}-form`;
const FORM_HEADER_CLASS = `${FORM_CLASS}-header`;
const FORM_WRAPPER_CLASS = `${FORM_CLASS}-wrapper`;
const FORM_GROUP_CLASS = `${FORM_CLASS}-group`;

const fetchLocations = async () => {
  return await API.graphql(graphqlOperation(q.listLocations), {});
};

const addLocation = async (lat: number, long: number, address: string) => {
  return await API.graphql(
    graphqlOperation(m.createLocation, {
      input: {
        latitude: lat,
        longitude: long,
        address: address,
      } as any as string,
    }),
    {}
  );
};

type lList = {
  id: number;
  longitude: string;
  latitude: number;
  address: number;
}[];

export const Locations = () => {
  const [locationList, setLocationList] = useState([] as lList);
  const memoList = useMemo(() => locationList, [locationList]);

  useEffect(() => {
    (async () => {
      const result = await fetchLocations();
      console.log("result: ", result);
      setLocationList((result as any).data.listLocations.items);
    })();
  }, []);

  // form to submit a new location
  const formik = useFormik({
    initialValues: {
      lat: 0,
      long: 0,
      address: "",
    },
    onSubmit: (values) => {
      const res = addLocation(values.lat, values.long, values.address);
      console.log(res);
    },
  });

  // table stuff
  const columns: Array<Column> = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Lat", accessor: "latitude" },
      { Header: "Long", accessor: "longitude" },
      { Header: "Address", accessor: "address" },
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

      <div className={FORM_WRAPPER_CLASS}>
        <h4 className={FORM_HEADER_CLASS}>add new location</h4>
        <Form onSubmit={formik.handleSubmit} className={FORM_CLASS}>
          <Form.Group className={`mb-3 ${FORM_GROUP_CLASS}`}>
            <Form.Label>Latitud</Form.Label>
            <Form.Control
              name="lat"
              type="number"
              value={formik.values.lat}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className={`mb-3 ${FORM_GROUP_CLASS}`}>
            <Form.Label>Latitud</Form.Label>
            <Form.Control
              name="long"
              type="number"
              value={formik.values.long}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Form.Group className={`mb-3 ${FORM_GROUP_CLASS}`}>
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Form>
      </div>
    </div>
  );
};
