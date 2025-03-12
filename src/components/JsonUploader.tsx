import { useState } from "react";
import axios from "axios";
import { Container, Box, Button } from "@mui/material";
import config from "../config";

const JsonUploader = () => {
  const [json, setJson] = useState<any>(null);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        alert("Has been selected invalid JSON.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          setJson(parsedData);
        } catch (error) {
          console.error("Invalid JSON file", error);
          alert("Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const submit = async () => {
    if (!json) {
      alert("No JSON data loaded.");
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/api/some-objects`, json, {
        headers: { "Content-Type": "application/json" },
      });

      alert("JSON uploaded successfully!");
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload JSON.");
    }
  };

  return (
    <Container>
      <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
      <Box>
        <input
          type="file"
          accept="application/json"
          onChange={selectFile}
          style={{ display: "none" }}
          id="json-input"
        />
        <label htmlFor="json-input">
          <Button variant="contained" component="span">
            Select JSON
          </Button>
        </label>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={submit}
        disabled={!json}
      >
        Upload JSON
      </Button>
      </Box>
    </Container >
  );
};

export default JsonUploader;
