import { useState, useRef } from 'react';
import axios from "axios"
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from 'recharts';
import { Table, Card, Container, Col, Row } from "react-bootstrap"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Main()
{
    const [symbol, setSymbol] = useState();
    const [date, setDate] = useState();
    const [adjusted, setAdjusted] = useState();
    const [info, setInfo] = useState(undefined);
    const hSymbol = (event) => {
        setSymbol(event.target.value.toUpperCase())
    }

    const hDate = (event) => {
        setDate(event.target.value)
    }

    const hAdjusted = (event) => {
        setAdjusted(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("here", symbol, date, adjusted)
        const data = {
            "symbol": symbol,
            "date": date,
            "adjusted": adjusted
        }
        axios.post("http://localhost:5000/api/fetchStockData/", data)
        .then(response => {
            console.log(response.data)
            setInfo(response.data)
        })
        .catch(error => {
            setInfo(undefined)
            console.log(error.response.data.message)
            toast.error(error.response.data.message);
            setDate("");
            setSymbol("");
            setDate("");
            setInfo(undefined);

        })
    }


    return (
      <>
        <Container>
          <center>
            <br></br>
            <h1> Stock Trading Information</h1>
            <br></br>
          </center>

          <br></br>
          <Row>
            <Col>
              <center>
                <form>
                  {/* <label>Symbol &nbsp;</label> */}
                  <input
                    type="text"
                    value={symbol}
                    onChange={hSymbol}
                    placeholder="Enter Symbol"
                    required
                  ></input>
                  <br></br>
                  <br></br>
                  {/* <label>Date &nbsp;</label> */}
                  <input
                    type="date"
                    value={date}
                    onChange={hDate}
                    pattern="\d{4}-\d{2}-\d{2}"
                    required
                  ></input>
                  <br></br>
                  <br></br>
                  {/* <label>Adjusted &nbsp;</label> */}
                  <select value={adjusted} onChange={hAdjusted} required>
                    <option value="" disabled selected>
                      Select Adjusted
                    </option>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                  <br></br>
                  <br></br>

                  <input
                    type="submit"
                    value="Submit"
                    onClick={handleSubmit}
                  ></input>
                  <br></br>
                  <br></br>
                </form>
              </center>
            </Col>
            <Col>
              {info !== undefined ? (
                <div>
                  <Card>
                    <Card.Body>
                      <Table>
                        <thead>
                          <tr>
                            <th> Open </th>
                            <th> High </th>
                            <th> Low </th>
                            <th> Close </th>
                            <th> Volume </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td> {info.open} </td>
                            <td> {info.high} </td>
                            <td> {info.low} </td>
                            <td> {info.close} </td>
                            <td> {info.volume} </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <div> <h4> Please fill form correctly to display data </h4></div>
              )}
            </Col>
          </Row>
        </Container>

        <ToastContainer />
      </>
    );
};

export default Main;