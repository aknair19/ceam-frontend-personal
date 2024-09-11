import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import "./index.css";
import { SlInput } from "@shoelace-style/shoelace";
import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { colors } from "@mui/material";

const BlacklistEmployee = () => {
  // const [verifyAadhar, setVerifyAadhar] = useState("");
  // const [verifyAadharBtn, setVerifyAadharBtn] = useState("");
  // const [verifyAadharData, setVerifyAadharData] = useState({});
  // const verifyAadharHandler = async () => {
  //   try {
  //     setVerifyAadharBtn(true);
  //     const data = await axios.post(
  //       `${import.meta.env.VITE_TEST_URL}/mhere/get-employee-by-aadhar`,
  //       {
  //         aadhar_card_number: verifyAadhar,
  //       }
  //     );
  //     setVerifyAadharData(data?.data);
  //     console.log(data?.data);
  //     setVerifyAadharBtn(false);
  //   } catch (err) {
  //     console.log(err);
  //     setVerifyAadharBtn(false);
  //   }
  // };
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
      setVerifyAadharData(data);
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
          {/* <SlInput
            placeholder="Enter Aadhar number"
            label="Employee Status"
            value={verifyAadhar}
            onSlChange={(e) => setVerifyAadhar(e.target.value)}
          /> */}
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
      <pre>
        {verifyAadharData && (
          <pre>{JSON.stringify(verifyAadharData, null, 2)}</pre>
        )}
      </pre>
    </div>
  );
};

export default BlacklistEmployee;
