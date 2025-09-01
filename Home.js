// src/pages/Home.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { saveShortLink, getShortLink } from "../Utils/Storage";
import { logEvent } from "../Middleware/Logger";

const generateRandomCode = () =>
  Math.random().toString(36).substring(2, 8);

export default function Home() {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "", error: "" },
  ]);
  const [results, setResults] = useState([]);
  const [globalError, setGlobalError] = useState("");

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    newInputs[index].error = "";
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "", error: "" }]);
    } else {
      setGlobalError("You can only shorten up to 5 URLs at once.");
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const newResults = [];
    const newInputs = [...inputs];

    newInputs.forEach((input, index) => {
      if (!input.url) {
        input.error = "URL is required";
        valid = false;
        return;
      }
      if (!validateUrl(input.url)) {
        input.error = "Invalid URL format";
        valid = false;
        return;
      }

      let shortcode = input.shortcode || generateRandomCode();

      // Ensure uniqueness
      while (getShortLink(shortcode)) {
        shortcode = generateRandomCode();
      }

      const validMinutes = input.validity
        ? parseInt(input.validity)
        : 30;
      if (isNaN(validMinutes) || validMinutes <= 0) {
        input.error = "Validity must be a positive integer";
        valid = false;
        return;
      }

      const expiry = Date.now() + validMinutes * 60 * 1000;

      const data = {
        originalUrl: input.url,
        shortcode,
        expiry,
        clicks: 0,
      };

      saveShortLink(shortcode, data);
      logEvent("Shortlink Created", data);
      newResults.push(data);
    });

    setInputs(newInputs);
    if (valid) {
      setResults(newResults);
      setGlobalError("");
    } else {
      setResults([]);
      setGlobalError("Fix the errors above and try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        URL Shortener
      </Typography>

      {globalError && <Alert severity="error">{globalError}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {inputs.map((input, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  URL #{index + 1}
                </Typography>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={input.url}
                  onChange={(e) =>
                    handleChange(index, "url", e.target.value)
                  }
                  margin="dense"
                  error={!!input.error}
                  helperText={input.error}
                />
                <TextField
                  label="Validity (minutes, default 30)"
                  type="number"
                  value={input.validity}
                  onChange={(e) =>
                    handleChange(index, "validity", e.target.value)
                  }
                  margin="dense"
                  sx={{ mr: 2 }}
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  value={input.shortcode}
                  onChange={(e) =>
                    handleChange(index, "shortcode", e.target.value)
                  }
                  margin="dense"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="outlined"
          color="primary"
          onClick={addInput}
          sx={{ mr: 2 }}
        >
          Add Another URL
        </Button>
        <Button variant="contained" color="success" type="submit">
          Shorten URLs
        </Button>
      </form>

      {results.length > 0 && (
        <Paper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Shortened URLs
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shortcode</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Expiry</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((res) => (
                <TableRow key={res.shortcode}>
                  <TableCell>
                    <a
                      href={`/${res.shortcode}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {res.shortcode}
                    </a>
                  </TableCell>
                  <TableCell>{res.originalUrl}</TableCell>
                  <TableCell>
                    {new Date(res.expiry).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
