import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import "./index.css";
import { SlInput } from "@shoelace-style/shoelace";
import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { colors } from "@mui/material";
import { blacklistHeaders } from "../../utils/constants";

const BlacklistEmployee = () => {
  const fetchAadharData = async (aadharCardNumber) => {
    const response = await axios.post(
      `${import.meta.env.VITE_TEST_URL}/mhere/get-employee-by-aadhar`,
      { aadhar_card_number: aadharCardNumber }
    );
    return response.data;
  };
  const [verifyAadhar, setVerifyAadhar] = useState("");
  const [verifyAadharData, setVerifyAadharData] = useState(null);
  const { mutate, isLoading, data, error } = useMutation({
    mutationFn: fetchAadharData,
    onSuccess: (data) => {
      setVerifyAadharData(data?.data);
      console.log(data);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message);
    },
  });
  const verifyAadharHandler = () => {
    mutate(verifyAadhar);
  };
  // console.log(verifyAadharData);
  const rows = [
    verifyAadharData?.employee_id,
    verifyAadharData?.employee_name,
    verifyAadharData?.vendor_code,
    verifyAadharData?.vendor_name,
    verifyAadharData?.gender == "M" ? "Male" : "Female",
    verifyAadharData?.base_location,
    verifyAadharData?.mobile_number,
    verifyAadharData?.DOL,
    verifyAadharData?.blacklistEmployee == 1 ? "Yes" : "No",
    verifyAadharData?.reason,
  ];

  const blacklistEMployeeHandler = async () => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_TEST_URL}/mhere/making-blacklist-employee`,
        {
          employee_id: verifyAadharData?.employee_id,
        }
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="main">
      <div className="blacklist-main">
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-multiline-flexible"
            placeholder="Enter Aadhar number"
            label="Verify Employee Status"
            onChange={(e) => setVerifyAadhar(e.target.value)}
            value={verifyAadhar}
            maxRows={4}
            variant="standard"
          />

          {verifyAadharData ? (
            <Button
              variant="contained"
              onClick={() => {
                setVerifyAadharData(null);
                setVerifyAadhar("");
              }}
              sx={{ marginTop: "1rem" }}
              color="error"
            >
              Clear
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={verifyAadharHandler}
              sx={{ marginTop: "1rem" }}
              disabled={isLoading}
              // disabled={verifyAadharBtn}
            >
              {isLoading ? "Verifying..." : "Verify Aadhar"}
            </Button>
          )}

          {error && <p>Error: {error.message}</p>}
        </Box>
      </div>
      {/* <pre>
        {verifyAadharData && (
          <pre>{JSON.stringify(verifyAadharData, null, 2)}</pre>
        )}
      </pre> */}
      {verifyAadharData && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {blacklistHeaders?.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {rows?.map((row, i) => (
                  <TableCell
                    style={{ maxWidth: 150 }}
                    component="th"
                    scope="row"
                    key={i}
                  >
                    {row}
                  </TableCell>
                ))}
                <Button
                  variant="contained"
                  // color="error"
                  sx={{ borderRadius: "100px", marginTop: "0.5rem" }}
                  disabled={
                    verifyAadharData?.blacklistEmployee == 1 ? true : false
                  }
                  onClick={blacklistEMployeeHandler}
                >
                  Ok
                </Button>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default BlacklistEmployee;
