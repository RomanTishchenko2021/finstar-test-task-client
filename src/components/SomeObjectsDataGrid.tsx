import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Container, TextField } from "@mui/material";
import { SomeObjectDto } from "../models/SomeObjectDto";
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import config from "../config";

const SomeObjectsDataGrid = () => {
    const [someObjects, setSomeObjects] = useState<SomeObjectDto>();
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "number", sort: "asc" }]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [filters, setFilters] = useState({ number: "", code: "", value: "" });
    const [resetButtonClick, setResetButtonClick] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const fetchSomeObjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.apiUrl}/api/some-objects`, {
                params: {
                    pageNumber: paginationModel.page + 1,
                    pageSize: paginationModel.pageSize,
                    SortBy: sortModel[0].field,
                    Descending: sortModel[0].sort === "desc" ? true : false,
                    Number: filters.number,
                    Code: filters.code,
                    Value: filters.value
                },
            });
            setSomeObjects(response.data);
            setRowCount(response.data["totalCount"]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSomeObjects();
    }, [paginationModel, resetButtonClick, hasActiveFilters]);

    const columns: GridColDef[] = [
        { field: "number", headerName: "Number" },
        { field: "code", headerName: "Code" },
        { field: "value", headerName: "Value" }
    ];

    const applyFilters = () => {
        if (filters.number || filters.code || filters.value) {
            setHasActiveFilters(hasActiveFilters ? false : true);
        }
    };

    const resetFilters = () => {
        if (filters.number || filters.code || filters.value) {
            setResetButtonClick(resetButtonClick ? false : true);
            setHasActiveFilters(false);
        }

        setFilters({ number: "", code: "", value: "" });
    };

    return (
        <Container>
            <Box display="flex" gap={2} mt={2} mb={2}>
                <TextField
                    label="Number"
                    variant="outlined"
                    size="small"
                    value={filters.number}
                    onChange={(e) => setFilters({ ...filters, number: e.target.value })}
                />
                <TextField
                    label="Code"
                    variant="outlined"
                    size="small"
                    value={filters.code}
                    onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                />
                <TextField
                    label="Value"
                    variant="outlined"
                    size="small"
                    value={filters.value}
                    onChange={(e) => setFilters({ ...filters, value: e.target.value })}
                />
                <Button variant="contained" onClick={applyFilters}>Apply</Button>
                <Button variant="contained" onClick={resetFilters}>Reset</Button>
            </Box>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.number}
                    rows={someObjects?.items}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    paginationMode="server"
                    sortingMode="server"
                    rowCount={rowCount}
                    loading={loading}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    disableRowSelectionOnClick
                />
            </div>
        </Container>
    );
}

export default SomeObjectsDataGrid;
